import json
import apiutils
import requests
import hackathon_utils


def handler(event, context):
    error, body = get_parameters(event)
    if error:
        return apiutils.response_message(body, 401)
    body_prompt = body["prompt"]
    benefit_completion = benefit_request(body_prompt).strip().split(",")
    feeling_completion = feeling_request(body_prompt).strip()
    message = f"{feeling_completion}. I recommend that you take advantage of {benefit_completion[0]} or {benefit_completion[1]} benefits"
    return apiutils.response_message_with_payload("success", {"response": message}, 200)


def get_parameters(event):
    error = False
    if event["body"]:
        body = event["body"]
        if type(event["body"]) == str:
            body = json.loads(event["body"])
        for key in ["prompt"]:
            if key not in body or not body[key]:
                error = True
                body = f"{key} is required"
                break
    else:
        error = True
        body = "Bad request"
    return error, body


def benefit_request(body_prompt):
    prompt = f"""
    There are this list of benefits available:
    {hackathon_utils.benefits}
    Based on the feeling described between "" you should select which two could help more. Give me the results separated by comma.
    ""{body_prompt}""
    """
    url = "https://api.openai.com/v1/completions"

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {hackathon_utils.api_key}",
    }

    data = {
        "model": "text-davinci-003",
        "prompt": prompt,
        # "max_tokens": 7,
        "temperature": 0.2,
        "n": 3,
    }

    response = requests.post(url, headers=headers, json=data)
    completion = response.json()["choices"][0]["text"].replace("\n", "")
    return completion


def feeling_request(body_prompt):
    prompt = f"""
    Based on the prevailing feeling of the message between "" give me a short message of support
    ""{body_prompt}""
    """
    url = "https://api.openai.com/v1/completions"

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {hackathon_utils.api_key}",
    }

    data = {
        "model": "text-davinci-003",
        "prompt": prompt,
        # "max_tokens": 7,
        "temperature": 0.2,
        "n": 3,
    }

    response = requests.post(url, headers=headers, json=data)
    completion = response.json()["choices"][0]["text"].replace("\n", "")
    return completion
