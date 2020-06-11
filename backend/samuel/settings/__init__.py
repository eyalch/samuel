# flake8: noqa

import environ

env = environ.Env(DEBUG=(bool, False))

from .auth import *
from .base import *
from .dynamic_preferences import *
from .email import *
from .corona import *
