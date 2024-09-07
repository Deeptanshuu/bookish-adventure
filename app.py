from flask import Flask, request, jsonify
from collections import defaultdict

app = Flask(__name__)

# Dictionary to store the leaderboard
leaderboard = defaultdict(int)

@app.route('/github', methods=['POST'])
def github_webhook():
    if request.method == 'POST':
        event_type = request.headers.get('X-GitHub-Event')
        payload = request.json

        # Handle the "pull_request" event
        if event_type == 'pull_request':
            action = payload.get('action')
            if action == 'closed' and payload.get('pull_request', {}).get('merged', False):
                username = payload['pull_request']['user']['login']
                leaderboard[username] += 1
                print(f"Accepted PR from {username}. Total: {leaderboard[username]}")

        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'failure'}), 400

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    sorted_leaderboard = dict(sorted(leaderboard.items(), key=lambda item: item[1], reverse=True))
    return jsonify(sorted_leaderboard)

if __name__ == '__main__':
    app.run(port=5000)
