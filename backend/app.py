from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask import send_from_directory
from flask_socketio import (
    SocketIO
)

from socket_events import (
    register_socket_events
)


load_dotenv()

from config.config import Config
from models.database import db, init_db
from middleware.auth import auth_required, role_required
from routes.auth import auth_bp
from routes.users import users_bp
from routes.clients import clients_bp
from routes.projects import projects_bp
from routes.workflow import workflow_bp
from routes.dashboard import dashboard_bp
from routes.employees import employees_bp
from routes.attendance import attendance_bp
from routes.leaves import leave_bp
from routes.communications import communication_bp

def create_app():
    app = Flask(__name__)
    socketio = SocketIO(
    app,
    cors_allowed_origins="*"
)
    CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)

    # Disable strict slash redirects
    app.url_map.strict_slashes = False

    # Configuration
    app.config.from_object(Config)

    # Enable CORS
    app.register_blueprint(
    employees_bp,
    url_prefix="/api/employees"
)
    
    app.register_blueprint(
    attendance_bp,
    url_prefix="/api/attendance"
)
    app.register_blueprint(
    leave_bp,
    url_prefix="/api/leaves"
)


    # JWT
    jwt = JWTManager(app)

    # Initialize database
    init_db(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(workflow_bp, url_prefix='/api/workflow')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(
    communication_bp,
    url_prefix="/api/communications"
)

    # Health check
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'WMS API is running'
        })

    # 404 Error
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Endpoint not found'
        }), 404

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(
        os.path.join(os.getcwd(), 'uploads'),
        filename
    )

    # 500 Error
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal server error'
        }), 500
        
    print(app.url_map)

    register_socket_events(
    socketio
)


    return app, socketio


if __name__ == '__main__':

    app, socketio = create_app()

    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True,
        allow_unsafe_werkzeug=True
    )
