// Color options (Standard Java Edition colors)
const colorOptions = [
    { name: "Black", code: "§0", bgColor: "#000000", fgColor: "#FFFFFF" },
    { name: "Dark Blue", code: "§1", bgColor: "#0000AA", fgColor: "#FFFFFF" },
    { name: "Dark Green", code: "§2", bgColor: "#00AA00", fgColor: "#FFFFFF" },
    { name: "Dark Aqua", code: "§3", bgColor: "#00AAAA", fgColor: "#FFFFFF" },
    { name: "Dark Red", code: "§4", bgColor: "#AA0000", fgColor: "#FFFFFF" },
    { name: "Dark Purple", code: "§5", bgColor: "#AA00AA", fgColor: "#FFFFFF" },
    { name: "Gold ", code: "§6", bgColor: "#FFAA00", fgColor: "#000000" },
    { name: "Gray", code: "§7", bgColor: "#AAAAAA", fgColor: "#000000" },
    { name: "Dark Gray", code: "§8", bgColor: "#555555", fgColor: "#FFFFFF" },
    { name: "Blue", code: "§9", bgColor: "#5555FF", fgColor: "#FFFFFF" },
    { name: "Green", code: "§a", bgColor: "#55FF55", fgColor: "#000000" },
    { name: "Aqua", code: "§b", bgColor: "#55FFFF", fgColor: "#000000" },
    { name: "Red", code: "§c", bgColor: "#FF5555", fgColor: "#000000" },
    { name: "Light Purple", code: "§d", bgColor: "#FF55FF", fgColor: "#000000" },
    { name: "Yellow", code: "§e", bgColor: "#FFFF55", fgColor: "#000000" },
    { name: "White", code: "§f", bgColor: "#FFFFFF", fgColor: "#000000" }
];

// Material color options (For Bedrock Edition)
const materialColorOptions = [
    { name: "Minecoin Gold", code: "§g", bgColor: "#DDD605", fgColor: "#000000" },
    { name: "Quartz", code: "§h", bgColor: "#E3D4D1", fgColor: "#000000" },
    { name: "Iron", code: "§i", bgColor: "#CECACA", fgColor: "#000000" },
    { name: "Netherite", code: "§j", bgColor: "#443A3B", fgColor: "#FFFFFF" },
    { name: "Redstone", code: "§m", bgColor: "#971607", fgColor: "#FFFFFF" },
    { name: "Copper", code: "§n", bgColor: "#B4684D", fgColor: "#FFFFFF" },
    { name: "Gold", code: "§p", bgColor: "#DEB12D", fgColor: "#000000" },
    { name: "Emerald", code: "§q", bgColor: "#47A036", fgColor: "#FFFFFF" },
    { name: "Diamond", code: "§s", bgColor: "#2CBAA8", fgColor: "#000000" },
    { name: "Lapis", code: "§t", bgColor: "#21497B", fgColor: "#FFFFFF" },
    { name: "Amethyst", code: "§u", bgColor: "#9A5CC6", fgColor: "#FFFFFF" },
    { name: "Resin", code: "§v", bgColor: "#EB7114", fgColor: "#FFFFFF" }
];

let currentColors = [...colorOptions, ...materialColorOptions];
let useJavaEdition = false;

// Sign background colors
const signBackgroundColors = {
    "No Background": { background: "#FFFFFF", text: "#000000" },
    "Oak": { background: "#af8f55", text: "#FFFFFF" },
    "Spruce": { background: "#7a5a34", text: "#FFFFFF" },
    "Birch": { background: "#c8b77a", text: "#000000" },
    "Jungle": { background: "#aa7954", text: "#FFFFFF" },
    "Acacia": { background: "#ad5d32", text: "#FFFFFF" },
    "Dark Oak": { background: "#492f17", text: "#FFFFFF" },
    "Crimson": { background: "#7e3a56", text: "#FFFFFF" },
    "Warped": { background: "#398382", text: "#FFFFFF" },
    "Mangrove": { background: "#773934", text: "#FFFFFF" },
    "Bamboo": { background: "#d2ba4f", text: "#000000" },
    "Cherry": { background: "#e7bab4", text: "#000000" }
};

let selectedColor = "White";
let layerColors = ["White", "White", "White", "White"];
let brightnessToggle = false;
let sectionBackground = signBackgroundColors["No Background"].background;
let isLayerEditingEnabled = false;

const colorCodeMap = {};
currentColors.forEach(color => {
    colorCodeMap[color.name] = {
        bgColor: color.bgColor,
        fgColor: color.fgColor,
        code: color.code
    };
});

let sections = []; // This will hold the ASCII art data loaded from JSON

// Function to fetch JSON data
async function loadJSONData() {
    try {
        const response = await fetch('ascii_art_letters.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        sections = await response.json();
        updateDisplay();
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        alert('Failed to load ASCII art data.');
    }
}

// Function to create background selection dropdown
function createBackgroundSelection() {
    const backgroundSelect = document.getElementById('backgroundSelect');
    Object.keys(signBackgroundColors).forEach(signType => {
        const option = document.createElement('option');
        option.value = signType;
        option.textContent = signType;
        option.style.backgroundColor = signBackgroundColors[signType].background;
        option.style.color = signBackgroundColors[signType].text;
        backgroundSelect.appendChild(option);
    });
    backgroundSelect.addEventListener('change', function() {
        changeSectionBackground(this.value);
    });
}

// Function to create color selection buttons
function createColorButtons(colors, id) {
    const colorSelectionDiv = document.getElementById('colorSelection' + id);
    colorSelectionDiv.innerHTML = ''; // Clear existing buttons
    colors.forEach(color => {
        const button = document.createElement('button');
        button.textContent = color.name;
        button.style.backgroundColor = color.bgColor;
        button.style.color = color.fgColor;
        button.title = color.name;
        button.addEventListener('click', () => setColor(color.name));
        colorSelectionDiv.appendChild(button);
    });
}

// Function to set the selected color
function setColor(colorName, override=false) {
    selectedColor = colorName;
    if (!isLayerEditingEnabled || override) {
        layerColors.fill(colorName);
    }
    updateLayerColors();
}

// Function to create layer color dropdowns
function createLayerColorDropdowns() {
    const layerColorDropdownsDiv = document.getElementById('layerColorDropdowns');
    layerColorDropdownsDiv.innerHTML = ''; // Clear existing dropdowns

    for (let i = 0; i < 4; i++) {
        const select = document.createElement('select');
        currentColors.forEach(color => {
            const option = document.createElement('option');
            option.value = color.name;
            option.textContent = color.name;
            option.style.backgroundColor = color.bgColor;
            option.style.color = color.fgColor;
            select.appendChild(option);
        });

        // Set the initial background color of the dropdown
        select.value = layerColors[i];
        const selectedColorBg = colorCodeMap[layerColors[i]].bgColor;
        const selectedColorFg = colorCodeMap[layerColors[i]].fgColor;
        select.style.backgroundColor = selectedColorBg;
        select.style.color = selectedColorFg;

        // Add an event listener to update the background color of the dropdown when the user selects a new color
        select.addEventListener('change', function() {
            layerColors[i] = this.value;
            const newColorBg = colorCodeMap[this.value].bgColor;
            const newColorFg = colorCodeMap[this.value].fgColor;
            this.style.backgroundColor = newColorBg;
            this.style.color = newColorFg;
            updateLayerColors();
        });

        layerColorDropdownsDiv.appendChild(select);
    }
}

// Function to update layer colors based on selection and brightness
function updateLayerColors() {
    const letterGrid = document.getElementById('letterGrid');
    Array.from(letterGrid.children).forEach((letterDiv, index) => {
        Array.from(letterDiv.children).forEach((layerDiv, i) => {
            if (i < 4) {
                const originalColor = colorCodeMap[layerColors[i]].bgColor;
                layerDiv.style.color = brightnessToggle ? darkenColor(originalColor) : originalColor;
            }
        });
    });
}

// Function to change section background color
function changeSectionBackground(backgroundName) {
    sectionBackground = signBackgroundColors[backgroundName].background;
    const backgroundSelect = document.getElementById('backgroundSelect');
    const selectedBg = signBackgroundColors[backgroundName];
    backgroundSelect.style.backgroundColor = selectedBg.background;
    backgroundSelect.style.color = selectedBg.text;
    updateDisplay();
}

// Function to update the display based on current settings
function updateDisplay() {
    const letterGrid = document.getElementById('letterGrid');
    letterGrid.innerHTML = ''; // Clear existing content

    displayLayeredAsciiButtons(); // Always use layered mode
    updateLayerColors();
}

// Function to display layered ASCII buttons
function displayLayeredAsciiButtons() {
    const letterGrid = document.getElementById('letterGrid');
    sections.forEach(section => {
        const layeredDiv = document.createElement('div');
        layeredDiv.className = 'layered-letter';
        layeredDiv.style.backgroundColor = sectionBackground;

        const fullContent = section.pattern.join('\n');

        // Display individual layers and add event listener for copying
        section.pattern.forEach((line, i) => {
            const layerDiv = document.createElement('div');
            layerDiv.textContent = line;
            layerDiv.style.top = `${i * 21}px`; // Dynamic style
            layerDiv.style.color = colorCodeMap[layerColors[i % layerColors.length]].bgColor; // Dynamic style
            layerDiv.classList.add('pointer-events-none'); // Use CSS class

            if (useJavaEdition) {
                layerDiv.classList.remove('pointer-events-none');
                layerDiv.classList.add('pointer-events-auto');
                layerDiv.addEventListener('click', () => copyToClipboardWithColor(line, i));
            }

            layeredDiv.appendChild(layerDiv);
        });

        // Add a transparent overlay to handle click events when Java Edition is off
        if (!useJavaEdition) {
            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('overlay');
            overlayDiv.addEventListener('click', () => copyToClipboard(fullContent));
            layeredDiv.appendChild(overlayDiv);
        }

        letterGrid.appendChild(layeredDiv);
    });
}

// Function to copy a specific line with its color to clipboard
function copyToClipboardWithColor(line, layerIndex) {
    const colorCode = colorCodeMap[layerColors[layerIndex % layerColors.length]].code;
    const textToCopy = `${colorCode}${line}§r`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to copy the full content to clipboard with color codes
function copyToClipboard(content) {
    const lines = content.split('\n');
    const coloredLines = lines.map((line, index) => {
        const colorCode = colorCodeMap[layerColors[index % 4]].code;
        return `${colorCode}${line}§r`;
    });
    const textToCopy = coloredLines.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to darken a hex color by a given percentage
function darkenColor(hexColor, percentage = 30) {
    hexColor = hexColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const factor = (100 - percentage) / 100;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Event listener for brightness toggle
document.getElementById('brightnessToggle').addEventListener('change', function() {
    brightnessToggle = this.checked;
    updateLayerColors();
});

// Event listener for layer editing toggle
document.getElementById('toggleLayerEditing').addEventListener('change', function() {
    isLayerEditingEnabled = this.checked;
    toggleLayerEditing(isLayerEditingEnabled);
});

// Event listener for Java Edition toggle
document.getElementById('toggleJavaEdition').addEventListener('change', function() {
    const colorSelectionDiv2 = document.getElementById('colorSelection2');
    useJavaEdition = this.checked;
    if (useJavaEdition) {
        currentColors = [...colorOptions];
        setColor("Black", true);
    } else {
        currentColors = [...colorOptions, ...materialColorOptions];
    }

    toggleColorSelectionDivs();
    if (isLayerEditingEnabled) {
        createLayerColorDropdowns(); // Recreate layer dropdowns if editing is enabled
    }

    toggleJavaInstructions(useJavaEdition)

    updateDisplay(); // Re-render the grid to add individual line click events for Java Edition
});

function toggleJavaInstructions(show) {
    const javaInstructions = document.querySelectorAll('.java-instructions');
    javaInstructions.forEach(function(element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

// Function to toggle layer editing mode
function toggleLayerEditing(enabled) {
    const layerColorDropdownsDiv = document.getElementById('layerColorDropdowns');
    const colorSelectionDiv1 = document.getElementById('colorSelection1');
    const colorSelectionDiv2 = document.getElementById('colorSelection2');
    if (enabled) {
        layerColorDropdownsDiv.classList.remove('hidden');
        colorSelectionDiv1.classList.add('hidden');
        colorSelectionDiv2.classList.add('hidden');
        createLayerColorDropdowns();
    } else {
        layerColorDropdownsDiv.classList.add('hidden');
        colorSelectionDiv1.classList.remove('hidden');
        toggleColorSelectionDivs();
        layerColors.fill(selectedColor); // Reset to use single color for all layers
        updateLayerColors();
    }
}

function toggleColorSelectionDivs() {
    const colorSelectionDiv1 = document.getElementById('colorSelection1');
    const colorSelectionDiv2 = document.getElementById('colorSelection2');
    if (!isLayerEditingEnabled) {
        if (useJavaEdition) {
            colorSelectionDiv1.classList.remove('hidden');
            colorSelectionDiv2.classList.add('hidden');
        } else {
            colorSelectionDiv1.classList.remove('hidden');
            colorSelectionDiv2.classList.remove('hidden');
        }
    }
}

// Function to initialize background selection and color buttons
function initializeControls() {
    createBackgroundSelection();
    createColorButtons(colorOptions, 1);
    createColorButtons(materialColorOptions, 2);
    setColor("Black");
    changeSectionBackground("Oak")
}

// Initialize controls and load JSON data
initializeControls();
loadJSONData();