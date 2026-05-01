// API Endpoint: POST /api/upload/image

function previewAnimalImage(input) {
    const file        = input.files[0];
    const preview     = document.getElementById('animal-image-preview');
    const placeholder = document.getElementById('image-upload-placeholder');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src          = e.target.result;
        preview.style.display   = 'block';
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}


async function uploadAnimalImage(animalId) {
    const input = document.getElementById('animal-image');
    const file  = input?.files[0];

    if (!file) return null;


    try {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('animalId', animalId);

        const data = await apiPostFormData('/upload/image', fd);

        if (!data.url) throw new Error('No URL returned from server');

        // คืนทั้ง url และ mid
        return { url: data.url, mid: data.mid };

    } catch (err) {
        console.error('uploadAnimalImage error:', err);
        alert('Image upload failed. Animal will be saved without image.');
        return null;
    }
}

function resetImageUpload() {
    const input       = document.getElementById('animal-image');
    const preview     = document.getElementById('animal-image-preview');
    const placeholder = document.getElementById('image-upload-placeholder');

    if (input)       input.value           = '';
    if (preview)     { preview.src = ''; preview.style.display = 'none'; }
    if (placeholder) placeholder.style.display = 'flex';
}