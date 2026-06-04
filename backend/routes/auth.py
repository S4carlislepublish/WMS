from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)

from models.employee import Employee
from models.user import User
from models.database import db
from datetime import datetime

auth_bp = Blueprint('auth', __name__)


# =========================
# LOGIN
# =========================

@auth_bp.route('/login', methods=['POST'])
def login():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'error': 'Request body is missing'
            }), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({
                'error': 'Email and password are required'
            }), 400

        # Find User
        user = User.query.filter_by(
            company_email=email
        ).first()

        if not user:
            return jsonify({
                'error': 'Invalid email or password'
            }), 401

        # Verify Password
        if not user.check_password(password):
            return jsonify({
                'error': 'Invalid email or password'
            }), 401

        # Check Active Status
        if not user.is_active:
            return jsonify({
                'error': 'Account is deactivated'
            }), 403

        # Find Employee Record
        employee = Employee.query.filter_by(
            user_id=user.id
        ).first()

        # Update Last Login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Create Tokens
        access_token = create_access_token(
            identity=str(user.id)
        )

        refresh_token = create_refresh_token(
            identity=str(user.id)
        )

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,

            'user': user.to_dict(),

            'role': (
                user.role.name
                if user.role else None
            ),

            'employee_id': (
                employee.id
                if employee else None
            ),

            'profile_completed': (
                employee.profile_completed
                if employee else False
            ),

            'is_first_login': (
                employee.is_first_login
                if employee else True
            ),

            'message': 'Login successful'
        }), 200

    except Exception as e:

        print("LOGIN ERROR:", str(e))

        return jsonify({
            'error': str(e)
        }), 500


# =========================
# CURRENT USER
# =========================
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():

    try:
        user_id = get_jwt_identity()

        user = User.query.get(int(user_id))

        if not user:
            return jsonify({
                'error': 'User not found'
            }), 404

        return jsonify({
            'user': user.to_dict(),
            'role': user.role.name if user.role else None,
            'team': user.team.name if user.team else None
        }), 200

    except Exception as e:

        print("ME ERROR:", str(e))

        return jsonify({
            'error': str(e)
        }), 500


# =========================
# LOGOUT
# =========================
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():

    return jsonify({
        'message': 'Logged out successfully'
    }), 200