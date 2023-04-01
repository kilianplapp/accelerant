FROM python:3.7-slim
#RUN apk update && apk add python3-dev \
#                        gcc \
#                        libc-dev \
#                        uwsgi-python3
RUN apt-get update
RUN apt-get install -y gcc
COPY ./ /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV PYTHONPATH /usr/local/lib/python3.7/site-packages:/usr/lib/python3.6/site-packages
CMD ["python", "-m", "gunicorn", "--w", "15", "--b", "0.0.0.0:80", "app:app"]