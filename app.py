from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from collections import defaultdict

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

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
                leaderboard[username] += 10  # 10 points per accepted PR
                print(f"Accepted PR from {username}. Total: {leaderboard[username]}")
                # Emit updated leaderboard to all connected clients
                emit_leaderboard()
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'failure'}), 400

def emit_leaderboard():
    sorted_leaderboard = dict(sorted(leaderboard.items(), key=lambda item: item[1], reverse=True))
    socketio.emit('leaderboard_update', sorted_leaderboard)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit_leaderboard()  # Send current leaderboard to newly connected client

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, port=5000)