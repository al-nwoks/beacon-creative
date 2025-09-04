import io
import logging
from PIL import Image, ImageOps
import base64
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


def resize_image_for_avatar(image_data: bytes, size: Tuple[int, int] = (300, 300)) -> bytes:
    """
    Resize an image for avatar use with recommended dimensions.
    
    Args:
        image_data: Raw image data as bytes
        size: Target size as (width, height) tuple
        
    Returns:
        Resized image as bytes
    """
    logger.info(f"Resizing image for avatar with target size: {size}")
    logger.debug(f"Original image data size: {len(image_data)} bytes")
    
    try:
        # Open the image
        image = Image.open(io.BytesIO(image_data))
        logger.debug(f"Original image dimensions: {image.width}x{image.height}, format: {image.format}, mode: {image.mode}")
        
        # Convert to RGB if necessary (for transparency handling)
        if image.mode in ('RGBA', 'LA', 'P'):
            logger.debug(f"Converting image from mode {image.mode} to RGB with white background")
            # Create a white background for transparent images
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            logger.debug(f"Converting image from mode {image.mode} to RGB")
            image = image.convert('RGB')
        
        # Resize the image using LANCZOS for high quality
        logger.debug(f"Resizing image from {image.width}x{image.height} to {size[0]}x{size[1]}")
        image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
        
        # Convert back to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=85, optimize=True)
        result_size = img_byte_arr.tell()
        
        logger.info(f"Avatar image resized successfully. Final size: {result_size} bytes")
        return img_byte_arr.getvalue()
    except Exception as e:
        logger.error(f"Error resizing avatar image: {str(e)}", exc_info=True)
        raise


def resize_image_for_portfolio(image_data: bytes, max_size: Tuple[int, int] = (1200, 800)) -> bytes:
    """
    Resize an image for portfolio use with recommended dimensions.
    
    Args:
        image_data: Raw image data as bytes
        max_size: Maximum size as (width, height) tuple
        
    Returns:
        Resized image as bytes
    """
    logger.info(f"Resizing image for portfolio with max size: {max_size}")
    logger.debug(f"Original image data size: {len(image_data)} bytes")
    
    try:
        # Open the image
        image = Image.open(io.BytesIO(image_data))
        logger.debug(f"Original image dimensions: {image.width}x{image.height}, format: {image.format}, mode: {image.mode}")
        
        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            logger.debug(f"Converting image from mode {image.mode} to RGB with white background")
            # Create a white background for transparent images
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            logger.debug(f"Converting image from mode {image.mode} to RGB")
            image = image.convert('RGB')
    
        # Resize maintaining aspect ratio
        logger.debug(f"Resizing image with thumbnail to max size {max_size[0]}x{max_size[1]}")
        original_size = (image.width, image.height)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        logger.debug(f"Image resized from {original_size[0]}x{original_size[1]} to {image.width}x{image.height}")
        
        # Convert back to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=85, optimize=True)
        result_size = img_byte_arr.tell()
        
        logger.info(f"Portfolio image resized successfully. Final size: {result_size} bytes")
        return img_byte_arr.getvalue()
    except Exception as e:
        logger.error(f"Error resizing portfolio image: {str(e)}", exc_info=True)
        raise


def image_to_base64(image_data: bytes) -> str:
    """
    Convert image bytes to base64 string for efficient handling.
    
    Args:
        image_data: Raw image data as bytes
        
    Returns:
        Base64 encoded string
    """
    logger.info(f"Converting image data to base64. Input size: {len(image_data)} bytes")
    
    try:
        result = base64.b64encode(image_data).decode('utf-8')
        logger.info(f"Image converted to base64 successfully. Output length: {len(result)} characters")
        return result
    except Exception as e:
        logger.error(f"Error converting image to base64: {str(e)}", exc_info=True)
        raise


def base64_to_image(base64_string: str) -> bytes:
    """
    Convert base64 string to image bytes.
    
    Args:
        base64_string: Base64 encoded image string
        
    Returns:
        Raw image data as bytes
    """
    logger.info(f"Converting base64 string to image data. Input length: {len(base64_string)} characters")
    
    try:
        result = base64.b64decode(base64_string)
        logger.info(f"Base64 converted to image data successfully. Output size: {len(result)} bytes")
        return result
    except Exception as e:
        logger.error(f"Error converting base64 to image: {str(e)}", exc_info=True)
        raise


def get_image_info(image_data: bytes) -> dict:
    """
    Get basic information about an image.
    
    Args:
        image_data: Raw image data as bytes
        
    Returns:
        Dictionary with image information
    """
    logger.info(f"Getting image information. Input size: {len(image_data)} bytes")
    
    try:
        image = Image.open(io.BytesIO(image_data))
        info = {
            'width': image.width,
            'height': image.height,
            'format': image.format,
            'mode': image.mode
        }
        logger.info(f"Image info retrieved: {info}")
        return info
    except Exception as e:
        logger.error(f"Error getting image information: {str(e)}", exc_info=True)
        raise