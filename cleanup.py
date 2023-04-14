def cleanup(bucket_name, prefix):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blobs = bucket.list_blobs(prefix=prefix)
    for blob in blobs:
        created_time = blob.time_created.replace(tzinfo=None)
        age = datetime.utcnow() - created_time
        if age > timedelta(days=30):
            blob.delete()
