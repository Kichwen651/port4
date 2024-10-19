const apiUrl = 'http://localhost:3000/dogs';

// Fetch all dogs and render them

function fetchDogs() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderDogs(data))
        .catch(error => console.error('Error fetching dog data:', error));
}

// Render dogs on the DOM
function renderDogs(dogs) {
    const dogGallery = document.getElementById('dog-gallery');
    dogGallery.innerHTML = ''; // Clear existing content

    dogs.forEach(dog => {
        const dogCard = document.createElement('div');
        dogCard.className = 'col-md-4 dog-card';
        dogCard.innerHTML = `
            <img src="${dog.Imageurl}" alt="${dog.name}">
            <h5>${dog.name}</h5>
            <p>Breed: ${dog.breed}</p>
            <p>Age: ${dog.age} years</p>
            <p>Description: ${dog.Description}</p>
            <p>Price: $${dog.Price}</p>
            <button class="btn btn-success" onclick="likeDog(${dog.id})">👍 Like</button>
            <button class="btn btn-info" onclick="shareDog(${dog.id})">🔗 Share</button>
            <button class="btn btn-warning" onclick="buyDog(${dog.id})">💰 Buy</button>
            <button class="btn btn-danger" onclick="deleteDog(${dog.id})">🗑️ Delete</button>
            <button class="btn btn-secondary" onclick="openEditModal(${dog.id})">✏️ Edit</button>
        `;
        dogGallery.appendChild(dogCard);
    });
}

// Add new dog
document.getElementById('add-dog-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const newDog = {
        name: document.getElementById('dog-name').value.trim(),
        breed: document.getElementById('dog-breed').value.trim(),
        age: parseInt(document.getElementById('dog-age').value),
        price: parseFloat(document.getElementById('dog-price').value),
        imageUrl: document.getElementById('dog-imageUrl').value.trim(),
        description: document.getElementById('dog-description').value.trim()
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDog)
    })
    .then(response => {
        if (response.ok) {
            alert('Dog added successfully!');
            fetchDogs(); // Refresh the list after adding
            document.getElementById('add-dog-form').reset(); // Reset form
        } else {
            throw new Error('Failed to add the dog.');
        }
    })
    .catch(error => console.error('Error adding dog:', error));
});

// Delete dog
function deleteDog(dogId) {
    const confirmation = confirm('Are you sure you want to delete this dog?');
    if (confirmation) {
        fetch(`${apiUrl}/${dogId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Dog deleted successfully!');
                    fetchDogs(); // Refresh the list after deletion
                } else {
                    throw new Error('Failed to delete the dog.');
                }
            })
            .catch(error => console.error('Error deleting dog:', error));
    }
}

//Open Edit Modal
function openEditModal(dogId) {
    fetch(`${apiUrl}/${dogId}`)
        .then(response => response.json())
        .then(dog => {
            document.getElementById('update-dog-id').value = dog.id;
            document.getElementById('update-dog-name').value = dog.name;
            document.getElementById('update-dog-breed').value = dog.breed;
            document.getElementById('update-dog-age').value = dog.age;
            document.getElementById('update-dog-price').value = dog.Price;
            document.getElementById('update-dog-description').value = dog.Description;
            document.getElementById('update-dog-imageUrl').value = dog.imageUrl; 

            const updateDogModal = new bootstrap.Modal(document.getElementById('updateDogModal'));
            updateDogModal.show();
        })
        .catch(error => console.error('Error fetching dog data for edit:', error));
}

// Update dog
document.getElementById('update-dog-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const dogId = document.getElementById('update-dog-id').value;
    const updatedDog = {
        name: document.getElementById('update-dog-name').value.trim(),
        breed: document.getElementById('update-dog-breed').value.trim(),
        age: parseInt(document.getElementById('update-dog-age').value),
        price: parseFloat(document.getElementById('update-dog-price').value),
        description: document.getElementById('update-dog-description').value.trim(),
        imageUrl: document.getElementById('update-dog-imageUrl').value.trim()
    };

    fetch(`${apiUrl}/${dogId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDog)
    })
    .then(response => {
        if (response.ok) {
            alert('Dog updated successfully!');
            fetchDogs(); // Refresh the list after updating
            const updateDogModal = bootstrap.Modal.getInstance(document.getElementById('updateDogModal'));
            updateDogModal.hide();
        } else {
            throw new Error('Failed to update the dog.');
        }
    })
    .catch(error => console.error('Error updating dog:', error));
});

// Like dog (example functionality)
function likeDog(dogId) {
    alert(`You liked ${dogId}!`);
}

// Share dog (example functionality)
function shareDog(dogId) {
    alert(`You shared ${dogId}!`);
}

// Buy dog (example functionality)
function buyDog(dogId) {
    alert(`You bought ${dogId}!`);
}


// Initial fetch to load dogs
fetchDogs();

