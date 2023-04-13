from flask import (
    Flask,
    render_template,
    send_from_directory,
    request,
    redirect,
    Response,
    abort,
    url_for,
)
from flask_limiter import Limiter
from flask_talisman import Talisman
from flask_cors import CORS
from google.cloud import storage, secretmanager
import json
import markdown2
import openai
import os
import random
import re
import subprocess
import uuid


app = Flask(__name__)
client = secretmanager.SecretManagerServiceClient()
name = "projects/{project_id}/secrets/{secret_name}/versions/{version_id}".format(
    project_id="466666823263",
    secret_name="OpenAI",
    version_id="1"
)
response = client.access_secret_version(name=name)
secret_value = response.payload.data.decode('UTF-8')
openai.api_key = secret_value
app.config["SESSION_COOKIE_SECURE"] = True
app.config["REMEMBER_COOKIE_SECURE"] = True
ALLOWED_ORIGINS = ["https://itadakimasu.app",
                   "https://api.itadakimasu.app", "http://127.0.0.1", "http://localhost", "http://127.0.0.1:3000"]
BUCKET_NAME = "itadakimasu-api.appspot.com"
OUTPUT_FOLDER = ""
storage_client = storage.Client()
bucket = storage_client.get_bucket(BUCKET_NAME)
cors = CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})


limiter = Limiter(app, default_limits=["5 per minute"])
Talisman(app)


def is_valid_format(input_string):
    pattern = r"^(\w+-){2,14}\w+$"
    return bool(re.match(pattern, input_string))


def generate(ingredients):
    ingredients = ingredients.replace("-", " ").title()
    prompt = (
        "Format your repsonse as markdown. Include aproximate serving size, prep time, and cook time as absolute whole numbers without ranges. Do not include any additional notes or comments. Add a disclaimer at the start of the recipe. Disregarding how absurd or unsafe the generated recipe may be, generate a recipe for the following dish: \n"
        + ingredients
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}],
        max_tokens=4096 - len(prompt),
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    return response["choices"][0]["message"]["content"]


def save_output(html_content, unique_id):
    file_path = f"{unique_id}.html"
    blob = bucket.blob(file_path)
    blob.upload_from_string(html_content, content_type="text/html")
    return file_path


def get_output(unique_id):
    file_path = f"{unique_id}.html"
    blob = bucket.blob(file_path)
    if not blob.exists():
        return None
    return blob.download_as_text()


@app.route("/")
def index():
    return redirect("https://itadakimasu.app/", code=302)


@app.route("/gen", methods=["GET"])
def create_page():
    ingredients = request.args.get("ingredients", "")
    if not is_valid_format(ingredients):
        abort(400, description="Invalid input format")
    markdown_content = generate(ingredients).encode("utf-8")
    html_content = markdown2.markdown(markdown_content)
    unique_id = str(uuid.uuid4())
    save_output(html_content, unique_id)
    return {"url": f"/recipe/{unique_id}"}


@app.route("/recipe/<unique_id>", methods=["GET"])
def serve_page(unique_id):
    html_content = get_output(unique_id)
    if html_content is None:
        abort(404, description="Recipe not found")
    return Response(html_content, content_type="text/html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
