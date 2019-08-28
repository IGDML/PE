from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from . import models


def kmeans(request):
    cluster = request.GET.get('cluster', '10') # get the parameter from the request 
    data = models.Wells.objects.all()
    json_res = serializers.serialize('python', data)
    response = {
        'test': json_res
    }
    return JsonResponse(response)