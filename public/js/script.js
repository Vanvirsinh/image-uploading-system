let modal = $('#modal');
let modalBackground = $('.modal-background');
let modalClose = $('#modal .modal-header span');
let addImages = $('#addImages');
let imageContainer = $('.image-container');
let form = $('#upload');
let fileInput = $('.modal-body input');
let imagePreview = $('.image-preview');
let deleteImageForm = $('#delete');

// Modal opening
addImages.click(() => {
    modal.slideDown();
    modalBackground.fadeIn();
});

// Modal closing
modalClose.click(() => {
    modal.slideUp();
    modalBackground.fadeOut();
});


// Previewing Images on input change event
let selectedFiles = [];
let id = 0;

fileInput.on("change", function () {
    imagePreview.empty();
    const files = $(this).get(0).files;
    for (let i = 0; i < files.length; i++) {
        selectedFiles.push({
            id: id,
            file: files[i]
        });
        id++;
    }
    displayImages();
});

function displayImages() {
    let images = "";
    for (let i = 0; i < selectedFiles.length; i++) {
        images += `<div>
          <img src="${URL.createObjectURL(selectedFiles[i].file)}" alt="image">
          <span onclick="removeSavedImage(${selectedFiles[i].id}, this)">&times;</span>
          </div>`;
    }
    imagePreview.html(images);
}


// Removing Images from Preview
function removeSavedImage(index, elem) {
    $(elem).parent().remove();
    selectedFiles = selectedFiles.filter(item => item.id !== index);
}


// Uploading Images
form.submit((e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i].file);
    }

    fetch('upload', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.status === 401) {
            alert(response.statusText);
            throw Error(response.statusText);
        }
        location.reload();
    }).catch((err) => {
        console.log(err);
    });
});


// Displaying saved image
if (myObject.length > 0) {
    renderImages();
} else {
    imageContainer.html('<p>No images added yet. Click on Add Images button👆!</p>');
}

function renderImages() {
    let images = '';
    myObject.forEach((image, index) => {
        images += `<div class="image">
          <img src="http://localhost:3000/images/${image}" alt="image" data-id="${index}">
        </div>`;
    });
    imageContainer.html(images);
}


// Selecting and Unselecting Images
let selectedImageToRemove = [];

imageContainer.on('click', '.image', function () {

    let isNotSelected = $(this).css('border-color') === 'rgb(255, 255, 255)';
    const index = $(this).children().attr('data-id');
    const currentImage = myObject[index];

    if (isNotSelected) {
        $(this).css('border-color', 'blue');
        selectedImageToRemove.push(currentImage);
    } else {
        $(this).css('border-color', 'white');
        selectedImageToRemove = selectedImageToRemove.filter(item => item !== currentImage);
    }

    if (selectedImageToRemove.length > 0) {
        deleteImageForm.show();
    } else {
        deleteImageForm.hide();
    }

});



// Deleting Images
deleteImageForm.submit((e) => {
    e.preventDefault();

    fetch('delete', {
        method: 'POST',
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-type": "application/json"
        },
        body: JSON.stringify({ selectedImageToRemove })
    }).then((response) => {
        if (response.status === 401) {
            alert(response.statusText);
            throw Error(response.statusText);
        }
        location.reload();
    }).catch((err) => {
        console.log(err);
    });

});