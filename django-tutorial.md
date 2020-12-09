# Django Tutorial: Building a Simple Polls Web App

This tutorial is based on <https://docs.djangoproject.com/en/3.1/intro/>. Terminal commands are for macOS and the fish shell.

## Creating a Virtual Environment

It is always a good idea to keep your development environments separate. There are three steps:  

1. Install the virtual environment
2. Activate it, and  
3. Install the dependencies for your app (e.g., via `pip install`, such as `pip install Django` -- no need to cd into venv folder as long as virtual environment is running

A virtual environment is part of the local setup. It should not be added to Git. Describe it in a readme, such that it can be easily recreated by everyone cloning the project.

Install the virtual environment, `venv`, with:

```shell
python3 -m venv venv
```

Activate your virtual environment with:  

```shell
source venv/bin/activate.fish  
```

You can deactivate your virtual environment with:

```shell
deactivate
```

## Installing Django

Install Django in your virtual environment:

```shell
python3 -m pip install Django
```

## Verifying Django Installation

Verify the installation:

```shell
python3
>>> import django
>>> print(django.get_version())
3.1
>>> exit()
```

## Creating a Project

Auto-generate a Django project, including database configuration, Django-specific options and application-specific settings.

In your virtual environment run:

```shell
>>> django-admin startproject mysite .
```

This will create a mysite directory in your current directory. Do not forget the dot at the end of the command to do it in the current directory!

```tree
.
+-- manage.py
+-- mysite/
|   +-- __init__.py
|   +-- asgi.py
|   +-- settings.py
|   +-- urls.py
|   +-- wsgi.py
```

These files are:

- _manage.py_: A command-line utility that lets you interact with this Django project in various ways.
- The _mysite/_ directory is the actual Python package for your project.
- _\_\_init\_\_.py_: An empty file that tells Python that this directory should be considered a Python package.
- _asgi.py_: An entry-point for ASGI-compatible web servers to serve your project.
- _settings.py_: Settings/configuration for this Django project.
- _urls.py_: The URL declarations for this Django project; a “table of contents” of your Django-powered site.
- _wsgi.py_: An entry-point for WSGI-compatible web servers to serve your project.

By the way, you can view the structure of your current directory nicely with:

```shell
tree
```

## Running Your Project

Run your project with:

```shell
python manage.py runserver
```

You've started the Django development server, a lightweight Web server written purely in Python. We've included this with Django so you can develop things rapidly, without having to deal with configuring a production server – such as Apache – until you're ready for production.

Now's a good time to note: don't use this server in anything resembling a production environment. It's intended only for use while developing.

Now that the server's running, visit <http://127.0.0.1:8000/> with your Web browser. You'll see a "Congratulations!" page, with a rocket taking off. It worked!

You can stop the server with `control` + `c`.

## Creating the Polls App

To create your app, make sure you're in the same directory as _manage.py_ and the virtual environment is activated. Then, type this command:

```shell
python manage.py startapp polls
```

That'll create a directory _polls_, which is laid out like this:

```tree
.
+-- __init__.py
+-- admin.py
+-- apps.py
+-- migrations
|   +-- __init__.py
+-- models.py
+-- tests.py
+-- views.py
```

This directory structure will house the poll application.

## Write Your First View

Let's write the first view. Open the file _views.py_ and put the following Python code in it:

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

This is the simplest view possible in Django. To call the view, we need to map it to a URL - and for this we need a URLconf.

To create a URLconf in the polls directory, create a file called _urls.py_. Your app directory should now look like:

```tree
.
+-- __init__.py
+-- admin.py
+-- apps.py
+-- migrations
|   +-- __init__.py
+-- models.py
+-- tests.py
+-- urls.py
+-- views.py
```

In the _polls/urls.py_ file include the following code:

```python
from django.urls import path
import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

The next step is to point the root URLconf at the polls.urls module. In _mysite/urls.py_, add an import for `django.urls.include` and insert an `include()` in the urlpatterns list, so you have:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

The `include()` function allows referencing other URLconfs. Whenever Django encounters `include()`, it chops off whatever part of the URL matched up to that point and sends the remaining string to the included URLconf for further processing.

The idea behind `include()` is to make it easy to plug-and-play URLs. Since polls are in their own URLconf (_polls/urls.py_), they can be placed under "/polls/", or under "/fun_polls/", or under "/content/polls/", or any other path root, and the app will still work.

You have now wired an index view into the URLconf. Verify it's working with the following command:

```shell
python manage.py runserver
```

Go to <http://localhost:8000/polls/> in your browser, and you should see the text "Hello, world. You're at the polls index.", which you defined in the index view.

The `path()` function is passed four arguments, two required: `route` and `view`, and two optional: `kwargs`, and `name`. At this point, it’s worth reviewing what these arguments are for.

### `path()` argument: `route`

`route` is a string that contains a URL pattern. When processing a request, Django starts at the first pattern in urlpatterns and makes its way down the list, comparing the requested URL against each pattern until it finds one that matches.

### `path()` argument: `view`

When Django finds a matching pattern, it calls the specified view function with an `HttpRequest` object as the first argument and any "captured" values from the route as keyword arguments.

### `path()` argument: `kwargs`

Arbitrary keyword arguments can be passed in a dictionary to the target view.

### `path()` argument: `name`

Naming your URL lets you refer to it unambiguously from elsewhere in Django, especially from within templates. This powerful feature allows you to make global changes to the URL patterns of your project while only touching a single file.

## Database Setup

Now, open up _mysite/settings.py_. It's a normal Python module with module-level variables representing Django settings.

By default, the configuration uses SQLite. If you're new to databases, or you're just interested in trying Django, this is the easiest choice. SQLite is included in Python, so you won't need to install anything else to support your database. When starting your first real project, however, you may want to use a more scalable database like PostgreSQL, to avoid database-switching headaches down the road.

Also, note the `INSTALLED_APPS` setting at the top of the file. That holds the names of all Django applications that are activated in this Django instance. Apps can be used in multiple projects, and you can package and distribute them for use by others in their projects.

By default, `INSTALLED_APPS` contains the following apps, all of which come with Django:

- _django.contrib.admin_ – The admin site. You'll use it shortly.
- _django.contrib.auth_ – An authentication system.
- _django.contrib.contenttypes_ – A framework for content types.
- _django.contrib.sessions_ – A session framework.
- _django.contrib.messages_ – A messaging framework.
- _django.contrib.staticfiles_ – A framework for managing static files.
These applications are included by default as a convenience for the common case.

Some of these applications make use of at least one database table, though, so we need to create the tables in the database before we can use them. To do that, run the following command from within the directory of your _manage.py_:

```shell
python manage.py migrate
```

The `migrate` command looks at the `INSTALLED_APPS` setting and creates any necessary database tables according to the database settings in your _mysite/settings.py_ file and the database migrations shipped with the app.

## Creating Models

Now we'll define your models – essentially, your database layout, with additional metadata.

A model is the single, definitive source of truth about your data. It contains the essential fields and behaviors of the data you’re storing.

This includes the migrations - unlike in Ruby On Rails, for example, migrations are entirely derived from your models file, and are essentially a history that Django can roll through to update your database schema to match your current models.

In our poll app, we'll create two models: Question and Choice. A Question has a question and a publication date. A Choice has two fields: the text of the choice and a vote tally. Each Choice is associated with a Question.

These concepts are represented by Python classes. Edit the polls/models.py file so it looks like this:

```python
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```

Here, each model is represented by a class that subclasses _django.db.models.Model_. Each model has a number of class variables, each of which represents a database field in the model.

Each field is represented by an instance of a Field class – e.g., `CharField` for character fields and `DateTimeField` for datetimes. This tells Django what type of data each field holds.

The name of each Field instance (e.g. `question_text` or `pub_date`) is the field's name, in machine-friendly format. You'll use this value in your Python code, and your database will use it as the column name.

Some Field classes have required arguments. `CharField`, for example, requires that you give it a `max_length`. That's used not only in the database schema, but in validation, as we'll soon see.

A Field can also have various optional arguments; in this case, we've set the default value of votes to 0.

Finally, note a relationship is defined, using `ForeignKey`. That tells Django each Choice is related to a single Question. Django supports all the common database relationships: many-to-one, many-to-many, and one-to-one.

## Activating Models

That small bit of model code gives Django a lot of information. With it, Django is able to:

- Create a database schema (`CREATE TABLE` statements) for this app.
- Create a Python database-access API for accessing Question and Choice objects.

But first we need to tell our project that the polls app is installed.

To include the app in our project, we need to add a reference to its configuration class in the `INSTALLED_APPS` setting. The `PollsConfig` class is in the _polls/apps.py_ file. Edit the _mysite/settings.py_ file and add thae path to the INSTALLED_APPS setting. It'll look like this:

```python
INSTALLED_APPS = [
    'polls.apps.PollsConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

Now Django knows to include the polls app. Let's run another command:

```shell
python manage.py makemigrations polls
```

By running makemigrations, you're telling Django that you've made some changes to your models (in this case, you've made new ones) and that you'd like the changes to be stored as a migration.

Migrations are how Django stores changes to your models (and thus your database schema) - they're files on disk. You can read the migration for your new model if you like; it's the file _polls/migrations/0001_initial.py_. Don’t worry, you're not expected to read them every time Django makes one, but they're designed to be human-editable in case you want to manually tweak how Django changes things.

There's a command that will run the migrations for you and manage your database schema automatically - that's called migrate, and we'll come to it in a moment - but first, let's see what SQL that migration would run. The sqlmigrate command takes migration names and returns their SQL:

```shell
python manage.py sqlmigrate polls 0001
```

You should see something similar to the following (reformatted for readability):

```shell
BEGIN;
--
-- Create model Question
--
CREATE TABLE "polls_question" (
    "id" serial NOT NULL PRIMARY KEY,
    "question_text" varchar(200) NOT NULL,
    "pub_date" timestamp with time zone NOT NULL
);
--
-- Create model Choice
--
CREATE TABLE "polls_choice" (
    "id" serial NOT NULL PRIMARY KEY,
    "choice_text" varchar(200) NOT NULL,
    "votes" integer NOT NULL,
    "question_id" integer NOT NULL
);
ALTER TABLE "polls_choice"
  ADD CONSTRAINT
  "polls_choice_question_id_c5b4b260_fk_polls_question_id"
    FOREIGN KEY ("question_id")
    REFERENCES "polls_question" ("id")
    DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "polls_choice_question_id_c5b4b260" ON "polls_choice" ("question_id");

COMMIT;
```

Now, run migrate again to create those model tables in your database:

```shell
python manage.py migrate
```

The migrate command takes all the migrations that haven't been applied (Django tracks which ones are applied using a special table in your database called _django_migrations_) and runs them against your database - essentially, synchronizing the changes you made to your models with the schema in the database.

Migrations are very powerful and let you change your models over time, as you develop your project, without the need to delete your database or tables and make new ones - it specializes in upgrading your database live, without losing data. Remember the three-step guide to making model changes:

- Change your models (in _models.py_).
- Run `python manage.py makemigrations` to create migrations for those changes
- Run `python manage.py migrate` to apply those changes to the database.

The reason that there are separate commands to make and apply migrations is because you'll commit migrations to your version control system and ship them with your app; they not only make your development easier, they're also usable by other developers and in production.

## Playing with the API

Now, let's hop into the interactive Python shell and play around with the free API Django gives you. To invoke the Python shell, use this command:

```shell
python manage.py shell
```

We're using this instead of simply typing "python", because _manage.py_ sets the `DJANGO_SETTINGS_MODULE` environment variable, which gives Django the Python import path to your _mysite/settings.py_ file.

Once you're in the shell, explore the database API:

```python
>>> from polls.models import Choice, Question  # Import the model classes we just wrote.

# No questions are in the system yet.
>>> Question.objects.all()
<QuerySet []>

# Create a new Question.
# Support for time zones is enabled in the default settings file, so
# Django expects a datetime with tzinfo for pub_date. Use timezone.now()
# instead of datetime.datetime.now() and it will do the right thing.
>>> from django.utils import timezone
>>> q = Question(question_text="What's new?", pub_date=timezone.now())

# Save the object into the database. You have to call save() explicitly.
>>> q.save()

# Now it has an ID.
>>> q.id
1

# Access model field values via Python attributes.
>>> q.question_text
"What's new?"
>>> q.pub_date
datetime.datetime(2012, 2, 26, 13, 0, 0, 775217, tzinfo=<UTC>)

# Change values by changing the attributes, then calling save().
>>> q.question_text = "What's up?"
>>> q.save()

# objects.all() displays all the questions in the database.
>>> Question.objects.all()
<QuerySet [<Question: Question object (1)>]>
```

Wait a minute. `<Question: Question object (1)>` isn't a helpful representation of this object. Let's fix that by editing the Question model (in the _polls/models.py_ file) and adding a `__str__()` method to both `Question` and `Choice`:

```python
from django.db import models

class Question(models.Model):
    # ...
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    # ...
    def __str__(self):
        return self.choice_text
```

It's important to add `__str__()` methods to your models, not only for your own convenience when dealing with the interactive prompt, but also because objects' representations are used throughout Django's automatically-generated admin.

Let's also add a custom method to this model:

```python
import datetime

from django.db import models
from django.utils import timezone

class Question(models.Model):
    # ...
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
```

Save these changes and start a new Python interactive shell by running `python manage.py shell` again:

```Python
>>> from polls.models import Choice, Question

# Make sure our __str__() addition worked.
>>> Question.objects.all()
<QuerySet [<Question: What's up?>]>

# Django provides a rich database lookup API that's entirely driven by
# keyword arguments.
>>> Question.objects.filter(id=1)
<QuerySet [<Question: What's up?>]>
>>> Question.objects.filter(question_text__startswith='What')
<QuerySet [<Question: What's up?>]>

# Get the question that was published this year.
>>> from django.utils import timezone
>>> current_year = timezone.now().year
>>> Question.objects.get(pub_date__year=current_year)
<Question: What's up?>

# Request an ID that doesn't exist, this will raise an exception.
>>> Question.objects.get(id=2)
Traceback (most recent call last):
    ...
DoesNotExist: Question matching query does not exist.

# Lookup by a primary key is the most common case, so Django provides a
# shortcut for primary-key exact lookups.
# The following is identical to Question.objects.get(id=1).
>>> Question.objects.get(pk=1)
<Question: What's up?>

# Make sure our custom method worked.
>>> q = Question.objects.get(pk=1)
>>> q.was_published_recently()
True

# Give the Question a couple of Choices. The create call constructs a new
# Choice object, does the INSERT statement, adds the choice to the set
# of available choices and returns the new Choice object. Django creates
# a set to hold the "other side" of a ForeignKey relation
# (e.g. a question's choice) which can be accessed via the API.
>>> q = Question.objects.get(pk=1)

# Display any choices from the related object set -- none so far.
>>> q.choice_set.all()
<QuerySet []>

# Create three choices.
>>> q.choice_set.create(choice_text='Not much', votes=0)
<Choice: Not much>
>>> q.choice_set.create(choice_text='The sky', votes=0)
<Choice: The sky>
>>> c = q.choice_set.create(choice_text='Just hacking again', votes=0)

# Choice objects have API access to their related Question objects.
>>> c.question
<Question: What's up?>

# And vice versa: Question objects get access to Choice objects.
>>> q.choice_set.all()
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>
>>> q.choice_set.count()
3

# The API automatically follows relationships as far as you need.
# Use double underscores to separate relationships.
# This works as many levels deep as you want; there's no limit.
# Find all Choices for any question whose pub_date is in this year
# (reusing the 'current_year' variable we created above).
>>> Choice.objects.filter(question__pub_date__year=current_year)
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>

# Let's delete one of the choices. Use delete() for that.
>>> c = q.choice_set.filter(choice_text__startswith='Just hacking')
>>> c.delete()
```

## Introducing the Django Admin

Generating admin sites for your staff or clients to add, change, and delete content is tedious work that doesn't require much creativity. For that reason, Django entirely automates creation of admin interfaces for models.

Django was written in a newsroom environment, with a very clear separation between "content publishers" and the "public" site. Site managers use the system to add news stories, events, sports scores, etc., and that content is displayed on the public site. Django solves the problem of creating a unified interface for site administrators to edit content.

The admin isn't intended to be used by site visitors. It's for site managers.

### Creating an Admin User

First we'll need to create a user who can login to the admin site. Run the following command:

```shell
python manage.py createsuperuser
```

Enter your desired username and press enter. You will then be prompted for your desired email address. The final step is to enter your password. You will be asked to enter your password twice, the second time as a confirmation of the first.

### Starting the Development Server

The Django admin site is activated by default. Let's start the development server and explore it.

If the server is not running start it like so:

```shell
python manage.py runserver
```

Now, open a Web browser and go to "/admin/" on your local domain – e.g., <http://127.0.0.1:8000/admin/>. You should see the admin's login screen.

### Entering the Admin Site

Now, try logging in with the superuser account you created in the previous step. You should see the Django admin index page.

### Making the Poll App Modifiable in the Admin

But where's our poll app? It's not displayed on the admin index page.

Only one more thing to do: we need to tell the admin that Question objects have an admin interface. To do this, open the _polls/admin.py_ file, and edit it to look like this:

```python
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```

### Exploring the Free Admin Functionality

Now that we've registered Question, Django knows that it should be displayed on the admin index page.

## Views

A view is a "type" of Web page in your Django application that generally serves a specific function and has a specific template. In our poll application, we'll have the following four views:

- Question "index" page – displays the latest few questions.
- Question "detail" page – displays a question text, with no results but with a form to vote.
- Question "results" page – displays results for a particular question.
- Vote action – handles voting for a particular choice in a particular question.

In Django, web pages and other content are delivered by views. Each view is represented by a Python function (or method, in the case of class-based views). Django will choose a view by examining the URL that's requested (to be precise, the part of the URL after the domain name).

A URL pattern is the general form of a URL - for example: `/newsarchive/<year>/<month>/`.

To get from a URL to a view, Django uses what are known as `URLconfs`. A `URLconf` maps URL patterns to views.

This tutorial provides basic instruction in the use of `URLconfs`, and you can refer to URL dispatcher for more information.

## Writing more views

Now let's add a few more views to _polls/views.py_. These views are slightly different, because they take an argument:

```python
def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)

def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
```

Wire these new views into the _polls.urls_ module by adding the following `path()` calls in _polls/urls.py_:

```python
from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path('', views.index, name='index'),
    # ex: /polls/5/
    path('<int:question_id>/', views.detail, name='detail'),
    # ex: /polls/5/results/
    path('<int:question_id>/results/', views.results, name='results'),
    # ex: /polls/5/vote/
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```

## Write views that Actually do Something

Each view is responsible for doing one of two things: returning an `HttpResponse` object containing the content for the requested page, or raising an exception such as `Http404`. The rest is up to you.

Your view can read records from a database, or not. It can use a template system such as Django's – or a third-party Python template system – or not. It can generate a PDF file, output XML, create a ZIP file on the fly, anything you want, using whatever Python libraries you want.

All Django wants is that `HttpResponse`. Or an exception.

Because it's convenient, let's use Django's own database API, which we covered above. Here's one stab at a new `index()` view, which displays the latest 5 poll questions in the system, separated by commas, according to publication date in _polls/views.py_:

```python
from django.http import HttpResponse
from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output = ', '.join([q.question_text for q in latest_question_list])
    return HttpResponse(output)

# Leave the rest of the views (detail, results, vote) unchanged
```

There's a problem here, though: the page's design is hard-coded in the view. If you want to change the way the page looks, you'll have to edit this Python code. So let's use Django's template system to separate the design from Python by creating a template that the view can use.

First, create a directory called _templates_ in your polls directory. Django will look for templates in there.

Your project's TEMPLATES setting describes how Django will load and render templates. The default settings file configures a `DjangoTemplates` backend whose `APP_DIRS` option is set to `True`. By convention `DjangoTemplates` looks for a "templates" subdirectory in each of the `INSTALLED_APPS`.

Within the templates directory you have just created, create another directory called _polls_, and within that create a file called _index.html_. In other words, your template should be at _polls/templates/polls/index.html_. Because of how the app\_directories template loader works as described above, you can refer to this template within Django as _polls/index.html_.

Put the following code in that template:

```Django
{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```

**Note**: As explained on [Stackoverflow](https://stackoverflow.com/a/14887682), `{%` and `%}` are tags of the Django Template Language (similar to `<?` and `?>` in PHP). This is an example of a domain-specific language. It works because Django comes with a parser to interpret the language and make sense of it. A parser takes a string that might otherwise has no meaning in HTML or any other language, such as `{% block pasta %}` and converts it into something meaningful. In this case it ultimately outputs HTML.

As explained on another [post](https://stackoverflow.com/a/36468988), The double curly braces are part of the Django Template Language as well. The part encapsulated between double curly braces `{{ }}` is just a variable.

Now let's update our index view in _polls/views.py_ to use the template:

```python
from django.http import HttpResponse
from django.template import loader
from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    template = loader.get_template('polls/index.html')
    context = {
        'latest_question_list': latest_question_list,
    }
    return HttpResponse(template.render(context, request))
```

That code loads the template called _polls/index.html_ and passes it a `context`. The `context` is a dictionary mapping template variable names to Python objects.

Load the page by pointing your browser at "/polls/", and you should see a bulleted-list containing the "What’s up" question. The link points to the question's detail page.

### A shortcut: `render()`

It's a very common idiom to load a template, fill a context and return an `HttpResponse` object with the result of the rendered template. Django provides a shortcut. Here's the full `index()` view, rewritten:

```python
from django.shortcuts import render

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)
```

## Raising a 404 error

Now, let's tackle the question detail view – the page that displays the question text for a given poll. Here’s the view for _polls/views.py_:

```python
from django.http import Http404
from django.shortcuts import render

from .models import Question
# ...
def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, 'polls/detail.html', {'question': question})
```

The new concept here: The view raises the `Http404` exception if a question with the requested ID doesn't exist.

We'll discuss what you could put in that _polls/detail.html_ template a bit later, but if you'd like to quickly get the above example working, a file, _polls/templates/polls/detail.html_, containing just:

```Django
{{ question }}
```

will get you started for now.

## Use the Template System

Back to the `detail()` view for our poll application. Given the context variable question, here's what the _polls/templates/polls/detail.html_ template might look like:

```Django
<h1>{{ question.question_text }}</h1>
<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>
```

The template system uses dot-lookup syntax to access variable attributes. In the example of `{{ question.question_text }}`, first Django does a dictionary lookup on the object question. Failing that, it tries an attribute lookup – which works, in this case. If attribute lookup had failed, it would've tried a list-index lookup.

Method-calling happens in the `{% for %}` loop: `question.choice_set.all` is interpreted as the Python code `question.choice_set.all()`, which returns an iterable of Choice objects and is suitable for use in the `{% for %}` tag.

## Removing hardcoded URLs in templates

Remember, when we wrote the link to a question in the _polls/index.html_ template, the link was partially hardcoded like this:

```Django
<li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
```

The problem with this hardcoded, tightly-coupled approach is that it becomes challenging to change URLs on projects with a lot of templates. However, since you defined the name argument in the `path()` functions in the `polls.urls` module, you can remove a reliance on specific URL paths defined in your url configurations by using the `{% url %}` template tag:

```Django
<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>
```

The way this works is by looking up the URL definition as specified in the `polls.urls` module. You can see exactly where the URL name of 'detail' is defined below:

```Python
...
# the 'name' value as called by the {% url %} template tag
path('<int:question_id>/', views.detail, name='detail'),
...
```

If you want to change the URL of the polls detail view to something else, perhaps to something like _polls/specifics/12/_ instead of doing it in the template (or templates) you would change it in _polls/urls.py_:

```Python
...
# added the word 'specifics'
path('specifics/<int:question_id>/', views.detail, name='detail'),
...
```

## Namespacing URL names

The tutorial project has just one app, polls. In real Django projects, there might be five, ten, twenty apps or more. How does Django differentiate the URL names between them? For example, the polls app has a detail view, and so might an app on the same project that is for a blog. How does one make it so that Django knows which app view to create for a url when using the `{% url %}` template tag?

The answer is to add namespaces to your `URLconf`. In the _polls/urls.py_ file, go ahead and add an `app_name` to set the application namespace:

```Python
from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```

Now change your _polls/index.html_ template from:

```Django
<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>
```

to point at the namespaced detail view:

```Django
<li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>
```

## Write a minimal form

Let's update our poll detail template ("polls/templates/polls/detail.html"), so that the template contains an HTML `<form>` element:

```Django
<h1>{{ question.question_text }}</h1>

{% if error_message %}<p><strong>{{ error_message }}</strong></p>{% endif %}

<form action="{% url 'polls:vote' question.id %}" method="post">
{% csrf_token %}
{% for choice in question.choice_set.all %}
    <input type="radio" name="choice" id="choice{{ forloop.counter }}" value="{{ choice.id }}">
    <label for="choice{{ forloop.counter }}">{{ choice.choice_text }}</label><br>
{% endfor %}
<input type="submit" value="Vote">
</form>
```

A quick rundown:

- The above template displays a radio button for each question choice. The value of each radio button is the associated question choice's ID. The name of each radio button is "choice". That means, when somebody selects one of the radio buttons and submits the form, it'll send the POST data choice=# where # is the ID of the selected choice. This is the basic concept of HTML forms.
- We set the form's action to `{% url 'polls:vote' question.id %}`, and we set `method="post"`. Using `method="post"` (as opposed to `method="get"`) is very important, because the act of submitting this form will alter data server-side. Whenever you create a form that alters data server-side, use `method="post"`. This tip isn't specific to Django; it's good Web development practice in general.
- `forloop.counter` indicates how many times the for tag has gone through its loop
- Since we're creating a POST form (which can have the effect of modifying data), we need to worry about Cross Site Request Forgeries. Thankfully, you don't have to worry too hard, because Django comes with a helpful system for protecting against it. In short, all POST forms that are targeted at internal URLs should use the `{% csrf_token %}` template tag.

Now, let's create a Django view that handles the submitted data and does something with it. Above we created a `URLconf` for the polls application that includes this line in _polls/urls.py_:

```Python
path('<int:question_id>/vote/', views.vote, name='vote'),
```

We also created a dummy implementation of the `vote()` function. Let's create a real version. Add the following to _polls/views.py_:

```Python
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from .models import Choice, Question
# ...
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
```

This code includes a few things we haven't covered yet in this tutorial:

- `request.POST` is a dictionary-like object that lets you access submitted data by key name. In this case, `request.POST['choice']` returns the ID of the selected choice, as a string. `request.POST` values are always strings.

- Note that Django also provides `request.GET` for accessing GET data in the same way – but we're explicitly using `request.POST` in our code, to ensure that data is only altered via a POST call.

- `request.POST['choice']` will raise `KeyError` if choice wasn't provided in POST data. The above code checks for `KeyError` and redisplays the question form with an error message if choice isn't given.

- After incrementing the choice count, the code returns an `HttpResponseRedirect` rather than a normal `HttpResponse`. `HttpResponseRedirect` takes a single argument: the URL to which the user will be redirected (see the following point for how we construct the URL in this case).

- As the Python comment above points out, you should always return an `HttpResponseRedirect` after successfully dealing with POST data. This tip isn't specific to Django; it’s good Web development practice in general.

- We are using the `reverse()` function in the `HttpResponseRedirect` constructor in this example. This function helps avoid having to hardcode a URL in the view function. It is given the name of the view that we want to pass control to and the variable portion of the URL pattern that points to that view. In this case, using the URLconf we set up earlier, this `reverse()` call will return a string like `'/polls/3/results/'`, where the 3 is the value of `question.id`. This redirected URL will then call the 'results' view to display the final page.

`request` is an `HttpRequest` object.

After somebody votes in a question, the `vote()` view redirects to the results page for the question. Let's write that view in _polls/views.py_:

from django.shortcuts import get_object_or_404, render

```Python
def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/results.html', {'question': question})
```

This is almost exactly the same as the detail() view as earlier. The only difference is the template name. We'll fix this redundancy later.

Now, create a _polls/results.html_ template:

```Django
<h1>{{ question.question_text }}</h1>

<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }} -- {{ choice.votes }} vote{{ choice.votes|pluralize }}</li>
{% endfor %}
</ul>

<a href="{% url 'polls:detail' question.id %}">Vote again?</a>
```

Now, go to _/polls/1/_ in your browser and vote in the question. You should see a results page that gets updated each time you vote. If you submit the form without having chosen a choice, you should see the error message.

Note:

The code for our `vote()` view does have a small problem. It first gets the `selected_choice` object from the database, then computes the new value of votes, and then saves it back to the database. If two users of your website try to vote at exactly the same time, this might go wrong: The same value, let's say 42, will be retrieved for votes. Then, for both users the new value of 43 is computed and saved, but 44 would be the expected value. This is called a race condition.
