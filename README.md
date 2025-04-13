# Navigate to project directory
cd 

# BACKEND SETUP
# -------------

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# OR Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install Django dependencies
cd backend
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow

# Freeze requirements
pip freeze > requirements.txt

# Create migrations
python manage.py makemigrations api
python manage.py makemigrations authentication

# Apply migrations
python manage.py migrate

# Create superuser (follow prompts)
python manage.py createsuperuser

# Create fixtures (optional)
python manage.py dumpdata api.category api.product --indent 2 > api/fixtures/initial_data.json

# Load fixtures (optional)
python manage.py loaddata api/fixtures/initial_data.json

# Run Django server
python manage.py runserver

# FRONTEND SETUP
# --------------
# Open a new terminal and navigate to project root
cd 

# Install React dependencies
npm install
npm install axios react-router-dom

# Start React development server
npm start

# ADDITIONAL USEFUL COMMANDS
# --------------------------
# Collect static files (for production)
python manage.py collectstatic

# Create a new Django app
python manage.py startapp app_name

# Run Django shell
python manage.py shell

# Check for Django errors
python manage.py check

# Run Django tests
python manage.py test
