/* =========================================
   STYLE SYNTH AI
   FRONTEND PROTOTYPE
========================================= */


/* =========================================
   APP STATE
========================================= */

let wardrobe = JSON.parse(
  localStorage.getItem("styleSynthWardrobe")
) || [];

let activeCategory = "all";

let selectedHarmony = "Complementary";

let selectedColor = "#C7A35A";


/* =========================================
   PAGE NAVIGATION
========================================= */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

  button.addEventListener("click", () => {

    const page = button.dataset.page;

    showPage(page);

  });

});


function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {

    page.classList.remove("active-page");

  });


  const target = document.getElementById(pageId);

  if (target) {
    target.classList.add("active-page");
  }


  navButtons.forEach(button => {

    button.classList.remove("active");

    if (button.dataset.page === pageId) {
      button.classList.add("active");
    }

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================
   WARDROBE MODAL
========================================= */

function openWardrobeModal() {

  document
    .getElementById("wardrobeModal")
    .classList.add("show");

}


function closeWardrobeModal() {

  document
    .getElementById("wardrobeModal")
    .classList.remove("show");

}


/* Close modal when clicking outside */

document
  .getElementById("wardrobeModal")
  .addEventListener("click", function(e) {

    if (e.target === this) {
      closeWardrobeModal();
    }

  });


/* =========================================
   IMAGE PREVIEW
========================================= */

function previewItemImage(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    document.getElementById("itemImagePreview").innerHTML = `
      <img src="${e.target.result}" alt="Wardrobe item">
    `;

  };

  reader.readAsDataURL(file);

}


function previewBodyPhoto(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    document.getElementById("bodyPreview").innerHTML = `
      <img src="${e.target.result}" alt="Full body photo">
    `;

  };

  reader.readAsDataURL(file);

}


/* =========================================
   ADD WARDROBE ITEM
========================================= */

function addWardrobeItem(event) {

  event.preventDefault();


  const imageInput =
    document.getElementById("itemImage");

  const file = imageInput.files[0];


  const type =
    document.getElementById("itemType").value;

  const color =
    document.getElementById("itemColor").value;

  const occasion =
    document.getElementById("itemOccasion").value;

  const brand =
    document.getElementById("itemBrand").value ||
    "Independent";

  const material =
    document.getElementById("itemMaterial").value;

  const pattern =
    document.getElementById("itemPattern").value;


  let itemName = getItemName(type);


  if (file) {

    const reader = new FileReader();

    reader.onload = function(e) {

      saveItem({
        id: Date.now(),
        name: itemName,
        category: type,
        color,
        occasion,
        brand,
        material,
        pattern,
        image: e.target.result
      });

    };

    reader.readAsDataURL(file);

  } else {

    saveItem({
      id: Date.now(),
      name: itemName,
      category: type,
      color,
      occasion,
      brand,
      material,
      pattern,
      image: null
    });

  }

}


function getItemName(type) {

  const names = {

    top: "New Top",
    bottom: "New Bottom",
    shoes: "New Shoes",
    accessory: "New Accessory"

  };

  return names[type] || "Wardrobe Item";

}


function saveItem(item) {

  wardrobe.push(item);

  localStorage.setItem(
    "styleSynthWardrobe",
    JSON.stringify(wardrobe)
  );


  renderWardrobe();

  updateWardrobeCount();

  closeWardrobeModal();

  document
    .getElementById("wardrobeForm")
    .reset();

  document.getElementById("itemImagePreview").innerHTML = `
    <span>+</span>
    <p>Upload clothing photo</p>
  `;


  showToast("Added to your wardrobe.");

}


/* =========================================
   RENDER WARDROBE
========================================= */

function renderWardrobe() {

  const grid =
    document.getElementById("wardrobeGrid");

  const search =
    document
      .getElementById("wardrobeSearch")
      .value
      .toLowerCase();


  let filtered = wardrobe.filter(item => {

    const matchesCategory =
      activeCategory === "all" ||
      item.category === activeCategory;


    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.brand.toLowerCase().includes(search) ||
      item.occasion.toLowerCase().includes(search);


    return matchesCategory && matchesSearch;

  });


  if (filtered.length === 0) {

    grid.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">◇</div>

        <h3>Your wardrobe is waiting.</h3>

        <p>
          Add your first shirt, pants, shoes or accessory.
        </p>

        <button
          class="gold-button"
          onclick="openWardrobeModal()">
          Add Item
        </button>

      </div>
    `;

    return;

  }


  grid.innerHTML = filtered.map(item => {

    return `

      <article class="wardrobe-card">

        <div
          class="wardrobe-image"
          style="background:${item.color}18"
        >

          ${
            item.image

            ?

            `<img
              src="${item.image}"
              alt="${item.name}"
            >`

            :

            `<span style="
              font-size:55px;
              color:${item.color};
            ">◇</span>`

          }

          <span
            class="color-dot"
            style="background:${item.color}">
          </span>

        </div>


        <div class="wardrobe-info">

          <p class="item-brand">
            ${item.brand}
          </p>

          <h4>
            ${item.name}
          </h4>

          <p>
            ${capitalize(item.category)}
            ·
            ${item.material}
          </p>

          <p>
            ${item.occasion}
            ·
            ${item.pattern}
          </p>

        </div>

      </article>

    `;

  }).join("");

}


function filterWardrobe(category, button) {

  activeCategory = category;

  document
    .querySelectorAll(".category")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

  renderWardrobe();

}


function updateWardrobeCount() {

  document.getElementById(
    "wardrobeCount"
  ).textContent = wardrobe.length;

}


function capitalize(text) {

  if (!text) return "";

  return text.charAt(0).toUpperCase() +
    text.slice(1);

}


/* =========================================
   COLOR STUDIO
========================================= */

function updateColor(color) {

  selectedColor = color;

  document
    .getElementById("colorPreview")
    .style.background = color;

  document
    .getElementById("hexValue")
    .textContent = color.toUpperCase();

  document
    .getElementById("selectedHex")
    .textContent = color.toUpperCase();

  document
    .getElementById("selectedColorName")
    .textContent = getColorName(color);

}


function getColorName(hex) {

  const colors = {

    "#ff0000": "RED",
    "#0000ff": "BLUE",
    "#00ff00": "GREEN",
    "#ffff00": "YELLOW",
    "#000000": "BLACK",
    "#ffffff": "WHITE",
    "#c7a35a": "GOLD"

  };

  return colors[hex.toLowerCase()] || "SELECTED COLOR";

}


function selectHarmony(harmony, button) {

  selectedHarmony = harmony;

  document
    .querySelectorAll(".harmony")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

}


/* =========================================
   OUTFIT GENERATOR
========================================= */

function generateOutfit() {

  const output =
    document.getElementById("generatedOutfit");


  let tops =
    wardrobe.filter(item => item.category === "top");

  let bottoms =
    wardrobe.filter(item => item.category === "bottom");

  let shoes =
    wardrobe.filter(item => item.category === "shoes");

  let accessories =
    wardrobe.filter(item => item.category === "accessory");


  /*
    If wardrobe is empty, show demo outfit.
  */

  if (
    tops.length === 0 ||
    bottoms.length === 0
  ) {

    output.innerHTML = `

      <div class="outfit-result">

        ${createDemoOutfit(
          "TOP",
          "Classic Shirt",
          "#203A5F",
          "👕"
        )}

        ${createDemoOutfit(
          "BOTTOM",
          "Tailored Trousers",
          "#E4D5B9",
          "👖"
        )}

        ${createDemoOutfit(
          "SHOES",
          "Leather Loafers",
          "#6B4030",
          "👞"
        )}

        ${createDemoOutfit(
          "ACCESSORY",
          "Classic Watch",
          "#C7A35A",
          "⌚"
        )}

      </div>

      <div style="
        text-align:center;
        margin-top:25px;
        color:#98948c;
        font-size:11px;
      ">
        Demo outfit — add wardrobe pieces to generate
        combinations from your own collection.
      </div>

    `;

    return;

  }


  const top = tops[0];
  const bottom = bottoms[0];

  const shoe = shoes[0];

  const accessory = accessories[0];


  output.innerHTML = `

    <div class="outfit-result">

      ${createWardrobeOutfitItem(
        "TOP",
        top
      )}

      ${createWardrobeOutfitItem(
        "BOTTOM",
        bottom
      )}

      ${
        shoe

        ?

        createWardrobeOutfitItem(
          "SHOES",
          shoe
        )

        :

        createDemoOutfit(
          "SHOES",
          "Complete the look",
          "#6B4030",
          "👞"
        )

      }

      ${
        accessory

        ?

        createWardrobeOutfitItem(
          "ACCESSORY",
          accessory
        )

        :

        createDemoOutfit(
          "ACCESSORY",
          "Add accessory",
          "#C7A35A",
          "⌚"
        )

      }

    </div>

    <div style="
      margin-top:25px;
      padding:20px;
      background:rgba(199,163,90,0.05);
      border:1px solid rgba(199,163,90,0.2);
      border-radius:15px;
    ">

      <p class="eyebrow">
        AI STYLE NOTE
      </p>

      <p style="
        color:#98948c;
        font-size:12px;
        line-height:1.7;
      ">
        This combination uses
        <strong style="color:#c7a35a">
          ${selectedHarmony}
        </strong>
        color harmony and your wardrobe pieces.
        Add more items to create more combinations.
      </p>

    </div>

  `;

}


function createWardrobeOutfitItem(label, item) {

  return `

    <div class="outfit-item">

      <div
        class="mock-image"
        style="background:${item.color}22"
      >

        ${
          item.image

          ?

          `<img
            src="${item.image}"
            style="
              width:100%;
              height:100%;
              object-fit:contain;
            "
          >`

          :

          `<span style="color:${item.color}">
            ◇
          </span>`

        }

      </div>

      <h4>
        ${item.name}
      </h4>

      <span>
        ${label}
      </span>

    </div>

  `;

}


function createDemoOutfit(
  label,
  name,
  color,
  emoji
) {

  return `

    <div class="outfit-item">

      <div
        class="mock-image"
        style="background:${color}22;color:${color}"
      >
        ${emoji}
      </div>

      <h4>${name}</h4>

      <span>${label}</span>

    </div>

  `;

}


/* =========================================
   AI STYLE ANALYSIS
========================================= */

function analyzeStyle() {

  const preview =
    document.getElementById("bodyPreview");

  if (!preview.innerHTML.trim()) {

    showToast(
      "Please upload a full-body photo first."
    );

    return;

  }


  /*
    FRONTEND DEMO RESPONSE.

    A production version should send the image
    to your secure backend and then to a
    multimodal AI model.
  */


  document.getElementById("styleProfile").innerHTML = `

    <p class="eyebrow">
      AI OBSERVATION
    </p>

    <h3>
      Your Style Profile
    </h3>

    <p style="
      color:#98948c;
      font-size:12px;
      line-height:1.6;
      margin-top:8px;
    ">
      Here's a preliminary appearance-based style
      profile generated by the Style Synth interface.
    </p>


    <div class="profile-results">

      <div class="profile-result">

        <label>
          Skin-tone appearance
        </label>

        <strong>
          Warm / Neutral
        </strong>

      </div>


      <div class="profile-result">

        <label>
          Face shape
        </label>

        <strong>
          Oval
        </strong>

      </div>


      <div class="profile-result">

        <label>
          Color palette
        </label>

        <strong>
          Earthy + Deep Tones
        </strong>

      </div>


      <div class="profile-result">

        <label>
          Recommended colors
        </label>

        <strong>
          Olive · Navy · Cream
        </strong>

      </div>


      <div class="profile-result">

        <label>
          Hair direction
        </label>

        <strong>
          Layered / Textured
        </strong>

      </div>


      <div class="profile-result">

        <label>
          Style direction
        </label>

        <strong>
          Refined Minimal
        </strong>

      </div>

    </div>


    <div style="
      margin-top:20px;
      padding:17px;
      background:rgba(199,163,90,0.05);
      border:1px solid rgba(199,163,90,0.15);
      border-radius:13px;
    ">

      <p class="eyebrow">
        OUTFIT DIRECTION
      </p>

      <p style="
        color:#98948c;
        font-size:12px;
        line-height:1.7;
      ">
        Try deep navy or olive tops with cream,
        beige or charcoal bottoms. Complete the look
        with understated leather accessories.
      </p>

    </div>

  `;


  showToast("Style profile generated.");

}


/* =========================================
   AI CHAT
========================================= */

function handleChatKey(event) {

  if (event.key === "Enter") {

    sendMessage();

  }

}


function sendMessage() {

  const input =
    document.getElementById("chatInput");

  const text =
    input.value.trim();

  if (!text) return;


  const messages =
    document.getElementById("chatMessages");


  messages.innerHTML += `

    <div class="message user-message">
      ${escapeHTML(text)}
    </div>

  `;


  input.value = "";


  setTimeout(() => {

    const response =
      generateAIResponse(text);

    messages.innerHTML += `

      <div class="message ai-message">
        ${response}
      </div>

    `;

    messages.scrollTop =
      messages.scrollHeight;

  }, 700);

}


function generateAIResponse(question) {

  const q = question.toLowerCase();


  if (
    q.includes("shirt") &&
    q.includes("pant")
  ) {

    return `
      Try pairing your shirt with a neutral
      trouser such as beige, charcoal or navy.
      I can create a more specific combination
      when your wardrobe contains those pieces.
    `;

  }


  if (q.includes("date")) {

    return `
      For a date, aim for refined rather than
      over-styled. Try a clean fitted shirt,
      tailored trousers, minimal sneakers or
      loafers, and one understated accessory.
    `;

  }


  if (q.includes("wedding")) {

    return `
      For a wedding, consider a sophisticated
      palette such as navy, charcoal, cream,
      burgundy or deep green depending on the
      dress code.
    `;

  }


  if (q.includes("color")) {

    return `
      Your Style Synth profile can use your
      selected palette together with color
      harmony to find complementary and
      analogous combinations.
    `;

  }


  if (q.includes("wardrobe")) {

    return `
      I recommend adding your tops, bottoms,
      shoes and accessories first. Then I can
      create combinations around what you
      actually own.
    `;

  }


  return `
    Based on your Style Synth profile, I'd keep
    the outfit balanced: one statement element,
    coordinated colors and minimal accessories.
    Try asking me about a specific occasion,
    garment or color.
  `;

}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.querySelector("p").textContent =
    message;

  toast.classList.add("show");


  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  renderWardrobe();

  updateWardrobeCount();

  updateColor("#C7A35A");

});
