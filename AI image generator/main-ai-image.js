const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

let isImageGenerating = false;

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index) =>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn =  imgCard.querySelector(".download-btn");

        //set the image source to the Ai-generated image data
        const aiGeneratedImg= `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;


        //when the image is loaded, remove the loading class and set download attribute
        imgElement.onload = () =>{
            imgCard.classList.remove('loading');
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }

    });
}
const  generateAiImage = async (userPrompt, userImageQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body:  JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: 'b64_json'
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! please try again.");


        const { data } = await response.json();
        updateImageCard([...data]);
        }
    catch(error){
        alert(error.message);
    } finally{
        isImageGenerating = false;
    }
}


const handleFormSubmission = (e) => {
    e.preventDefault();

    if(isImageGenerating) return;
    isImageGenerating = true;
    
    const userPrompt= e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;



    const imgCardMarkup = Array.from({length: userImageQuantity}, () =>
     `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImage(userPrompt, userImageQuantity);
} 

generateForm.addEventListener("submit", handleFormSubmission);