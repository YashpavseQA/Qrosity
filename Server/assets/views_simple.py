"""
Simplified views for the assets app that don't require Redis.

This module provides a simplified implementation of the TemporaryUploadView
that stores metadata in a file instead of Redis for testing purposes.
"""

import os
import uuid
import json
from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings

from .serializers import TemporaryUploadSerializer

class SimpleTemporaryUploadView(APIView):
    """
    Simplified view for handling temporary file uploads without Redis.
    
    This view handles file uploads, stores them in a temporary location,
    and saves metadata to a JSON file for later retrieval.
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to upload temporary files.
        
        Args:
            request: The HTTP request
            
        Returns:
            Response: JSON response with temporary file metadata
        """
        serializer = TemporaryUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get the uploaded file
            uploaded_file = request.FILES['file']
            
            # Generate a unique ID for the temporary upload
            temp_id = str(uuid.uuid4())
            
            # Create a path for the temporary file
            temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp_uploads')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Save the file with a unique name
            file_path = os.path.join(temp_dir, f"{temp_id}_{uploaded_file.name}")
            
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            
            # Create metadata
            metadata = {
                'temp_id': temp_id,
                'original_filename': uploaded_file.name,
                'file_path': file_path,
                'file_size': uploaded_file.size,
                'content_type': uploaded_file.content_type,
                'created_at': datetime.now().timestamp(),
                'tenant_id': getattr(request, 'tenant_id', 1)  # Default to tenant 1 if not available
            }
            
            # Save metadata to a JSON file
            metadata_dir = os.path.join(settings.MEDIA_ROOT, 'temp_metadata')
            os.makedirs(metadata_dir, exist_ok=True)
            metadata_path = os.path.join(metadata_dir, f"{temp_id}.json")
            
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Return the temporary ID and other relevant information
            return Response({
                'temp_id': temp_id,
                'original_filename': uploaded_file.name,
                'file_size': uploaded_file.size,
                'content_type': uploaded_file.content_type
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
