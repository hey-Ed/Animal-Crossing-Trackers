const db = window.db;

function ref(path) { return db.ref(path); }
function set(refObj, data) { return refObj.set(data); }
function onValue(refObj, callback) { return refObj.on("value", snapshot => callback(snapshot)); }
function sanitizeKey(key) { return key.replace(/[.#$\[\]/ ]/g, "_"); }

// ─── STATE ────────────────────────────────────────────────────────────────────
let currentRoom  = null;
let currentMode  = "coop";
let myPseudo     = null;
let soundEnabled = true;

const grid        = document.getElementById("grid");
const counter     = document.getElementById("counter");
const title       = document.getElementById("title");
const scoreboard  = document.getElementById("scoreboard");
const gameSelect  = document.getElementById("gameSelect");
const categorySelect = document.getElementById("categorySelect");
const coopMenu    = document.getElementById("coopMenu");
const popSound    = new Audio("sounds/pop.mp3");
popSound.volume   = 0.3;

// ─── GRID COLUMNS ─────────────────────────────────────────────────────────────
const COLS_SINGLE = 8;
const COLS_ALL    = {
    dnm: 8,   // 32+32=64  → 8×8
    ep:  8,   // 48+48=96  → 8×12
    gc:  10,  // 40+40=80  → 10×8
    ww:  8,   // 56+56=112 → 8×14
    cf:  8,   // 64+64=128 → 8×16
    nl:  12,  // 72+72=144 → 12×12
    nh:  10,  // 80+80=160 → 10×16
};

function setGridCols(cols) {
    grid.style.setProperty("--grid-cols", cols);
}

// ─── FIREBASE TEST ────────────────────────────────────────────────────────────
try {
    if (typeof db !== "undefined") {
        db.ref("test").set({ status: "connected 🔥", timestamp: Date.now() });
        console.log("✅ Firebase connected");
    }
} catch (e) { console.log("❌ Firebase error:", e); }

// ─── MODE SELECTOR ────────────────────────────────────────────────────────────
document.getElementById("btnModeCoop").addEventListener("click", () => {
    currentMode = "coop";
    document.getElementById("btnModeCoop").classList.add("active");
    document.getElementById("btnModeRace").classList.remove("active");
    document.getElementById("coopFields").style.display = "block";
    document.getElementById("raceFields").style.display = "none";
});

document.getElementById("btnModeRace").addEventListener("click", () => {
    currentMode = "race";
    document.getElementById("btnModeRace").classList.add("active");
    document.getElementById("btnModeCoop").classList.remove("active");
    document.getElementById("raceFields").style.display = "block";
    document.getElementById("coopFields").style.display = "none";
});

// ─── ALL GAME DATA ────────────────────────────────────────────────────────────
const DATA = {

    // ── Doubutsu no Mori ──────────────────────────────────────────────────────
    dnm: {
        bugs: [
            ["Common butterfly","Common_Butterfly_PG_Icon_Upscaled.png"],
            ["Yellow butterfly","Yellow_Butterfly_PG_Icon_Upscaled.png"],
            ["Tiger butterfly","Tiger_Butterfly_PG_Icon_Upscaled.png"],
            ["Purple butterfly","Purple_Butterfly_PG_Icon_Upscaled.png"],
            ["Brown cicada","Brown_Cicada_PG_Icon_Upscaled.png"],
            ["Robust cicada","Robust_Cicada_PG_Icon_Upscaled.png"],
            ["Walker cicada","Walker_Cicada_PG_Icon_Upscaled.png"],
            ["Evening cicada","Evening_Cicada_PG_Icon_Upscaled.png"],
            ["Red dragonfly","Red_Dragonfly_PG_Icon_Upscaled.png"],
            ["Common dragonfly","Common_Dragonfly_PG_Icon_Upscaled.png"],
            ["Darner dragonfly","Darner_Dragonfly_PG_Icon_Upscaled.png"],
            ["Banded dragonfly","Banded_Dragonfly_PG_Icon_Upscaled.png"],
            ["Cricket","Cricket_PG_Icon_Upscaled.png"],
            ["Grasshopper","Grasshopper_PG_Icon_Upscaled.png"],
            ["Pine cricket","Pine_Cricket_PG_Icon_Upscaled.png"],
            ["Bell cricket","Bell_Cricket_PG_Icon_Upscaled.png"],
            ["Ladybug","Ladybug_PG_Icon_Upscaled.png"],
            ["Spotted ladybug","Spotted_Ladybug_PG_Icon_Upscaled.png"],
            ["Mantis","Mantis_PG_Icon_Upscaled.png"],
            ["Long locust","Long_Locust_PG_Icon_Upscaled.png"],
            ["Migratory locust","Migratory_Locust_PG_Icon_Upscaled.png"],
            ["Cockroach","Cockroach_PG_Icon_Upscaled.png"],
            ["Bee","Bee_PG_Icon_Upscaled.png"],
            ["Firefly","Firefly_PG_Icon_Upscaled.png"],
            ["Drone beetle","Drone_Beetle_PG_Icon_Upscaled.png"],
            ["Longhorn beetle","Longhorn_Beetle_PG_Icon_Upscaled.png"],
            ["Jewel beetle","Jewel_Beetle_PG_Icon_Upscaled.png"],
            ["Dynastid beetle","Dynastid_Beetle_PG_Icon_Upscaled.png"],
            ["Flat stag beetle","Flat_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Saw stag beetle","Saw_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Mountain beetle","Mountain_Beetle_PG_Icon_Upscaled.png"],
            ["Giant beetle","Giant_Beetle_PG_Icon_Upscaled.png"],
        ],
        fish: [
            ["Crucian carp","Crucian_Carp_PG_Icon_Upscaled.png"],
            ["Brook trout","Brook_Trout_PG_Icon_Upscaled.png"],
            ["Carp","Carp_PG_Icon_Upscaled.png"],
            ["Koi","Koi_PG_Icon_Upscaled.png"],
            ["Barbel steed","Barbel_Steed_PG_Icon_Upscaled.png"],
            ["Dace","Dace_PG_Icon_Upscaled.png"],
            ["Catfish","Catfish_PG_Icon_Upscaled.png"],
            ["Giant catfish","Giant_Catfish_PG_Icon_Upscaled.png"],
            ["Pale chub","Pale_Chub_PG_Icon_Upscaled.png"],
            ["Bitterling","Bitterling_PG_Icon_Upscaled.png"],
            ["Loach","Loach_PG_Icon_Upscaled.png"],
            ["Bluegill","Bluegill_PG_Icon_Upscaled.png"],
            ["Small bass","Small_Bass_PG_Icon_Upscaled.png"],
            ["Bass","Bass_PG_Inv_Icon_Upscaled.png"],
            ["Large bass","Large_Bass_PG_Icon_Upscaled.png"],
            ["Giant snakehead","Giant_Snakehead_PG_Icon_Upscaled.png"],
            ["Eel","Eel_PG_Icon_Upscaled.png"],
            ["Freshwater goby","Freshwater_Goby_PG_Icon_Upscaled.png"],
            ["Pond smelt","Pond_Smelt_PG_Icon_Upscaled.png"],
            ["Sweetfish","Sweetfish_PG_Icon_Upscaled.png"],
            ["Cherry salmon","Cherry_Salmon_PG_Icon_Upscaled.png"],
            ["Rainbow trout","Rainbow_Trout_PG_Icon_Upscaled.png"],
            ["Large char","Large_Char_PG_Icon_Upscaled.png"],
            ["Stringfish","Stringfish_PG_Icon_Upscaled.png"],
            ["Salmon","Salmon_PG_Icon_Upscaled.png"],
            ["Goldfish","Goldfish_PG_Icon_Upscaled.png"],
            ["Popeyed goldfish","Popeyed_Goldfish_PG_Icon_Upscaled.png"],
            ["Guppy","Guppy_PG_Icon_Upscaled.png"],
            ["Angelfish","Angelfish_PG_Icon_Upscaled.png"],
            ["Piranha","Piranha_PG_Icon_Upscaled.png"],
            ["Arowana","Arowana_PG_Icon_Upscaled.png"],
            ["Coelacanth","Coelacanth_PG_Icon_Upscaled.png"],
        ],
    },

    // ── Doubutsu no Mori e+ ───────────────────────────────────────────────────
    ep: {
        bugs: [
            ["Common butterfly","gc/bugs/Common_Butterfly_PG_Icon_Upscaled.png"],
            ["Yellow butterfly","gc/bugs/Yellow_Butterfly_PG_Icon_Upscaled.png"],
            ["Tiger butterfly","gc/bugs/Tiger_Butterfly_PG_Icon_Upscaled.png"],
            ["Purple butterfly","gc/bugs/Purple_Butterfly_PG_Icon_Upscaled.png"],
            ["Alexandra's swallowtail","e+/bugs/Alexandra's_Swallowtail_Butterfly_DnMe+_Icon_Upscaled.png"],
            ["Mantis","gc/bugs/Mantis_PG_Icon_Upscaled.png"],
            ["Long locust","gc/bugs/Long_Locust_PG_Icon_Upscaled.png"],
            ["Migratory locust","gc/bugs/Migratory_Locust_PG_Icon_Upscaled.png"],
            ["Red dragonfly","gc/bugs/Red_Dragonfly_PG_Icon_Upscaled.png"],
            ["Common dragonfly","gc/bugs/Common_Dragonfly_PG_Icon_Upscaled.png"],
            ["Darner dragonfly","gc/bugs/Darner_Dragonfly_PG_Icon_Upscaled.png"],
            ["Banded dragonfly","gc/bugs/Banded_Dragonfly_PG_Icon_Upscaled.png"],
            ["Brown cicada","gc/bugs/Brown_Cicada_PG_Icon_Upscaled.png"],
            ["Robust cicada","gc/bugs/Robust_Cicada_PG_Icon_Upscaled.png"],
            ["Walker cicada","gc/bugs/Walker_Cicada_PG_Icon_Upscaled.png"],
            ["Evening cicada","gc/bugs/Evening_Cicada_PG_Icon_Upscaled.png"],
            ["Cricket","gc/bugs/Cricket_PG_Icon_Upscaled.png"],
            ["Grasshopper","gc/bugs/Grasshopper_PG_Icon_Upscaled.png"],
            ["Pine cricket","gc/bugs/Pine_Cricket_PG_Icon_Upscaled.png"],
            ["Bell cricket","gc/bugs/Bell_Cricket_PG_Icon_Upscaled.png"],
            ["Ladybug","gc/bugs/Ladybug_PG_Icon_Upscaled.png"],
            ["Spotted ladybug","gc/bugs/Spotted_Ladybug_PG_Icon_Upscaled.png"],
            ["Drone beetle","gc/bugs/Drone_Beetle_PG_Icon_Upscaled.png"],
            ["Firefly","gc/bugs/Firefly_PG_Icon_Upscaled.png"],
            ["Longhorn beetle","gc/bugs/Longhorn_Beetle_PG_Icon_Upscaled.png"],
            ["Jewel beetle","gc/bugs/Jewel_Beetle_PG_Icon_Upscaled.png"],
            ["Dynastid beetle","gc/bugs/Dynastid_Beetle_PG_Icon_Upscaled.png"],
            ["Hercules beetle","e+/bugs/Hercules_Beetle_DnMe+_Icon_Upscaled.png"],
            ["Flat stag beetle","gc/bugs/Flat_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Saw stag beetle","gc/bugs/Saw_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Mountain beetle","gc/bugs/Mountain_Beetle_PG_Icon_Upscaled.png"],
            ["Giant beetle","gc/bugs/Giant_Beetle_PG_Icon_Upscaled.png"],
            ["Mole cricket","gc/bugs/Mole_Cricket_PG_Icon_Upscaled.png"],
            ["Snail","gc/bugs/Snail_PG_Icon_Upscaled.png"],
            ["Pill bug","gc/bugs/Pill_Bug_PG_Icon_Upscaled.png"],
            ["Spider","gc/bugs/Spider_PG_Icon_Upscaled.png"],
            ["Bagworm","gc/bugs/Bagworm_PG_Icon_Upscaled.png"],
            ["Flea","e+/bugs/Flea_DnMe+_Icon_Upscaled.png"],
            ["Mosquito","gc/bugs/Mosquito_PG_Icon_Upscaled.png"],
            ["Bee","gc/bugs/Bee_PG_Icon_Upscaled.png"],
            ["Pond skater","gc/bugs/Pond_Skater_PG_Icon_Upscaled.png"],
            ["Diving beetle","e+/bugs/Diving_Beetle_DnMe+_Icon_Upscaled.png"],
            ["Crab","e+/bugs/Crab_DnMe+_Icon_Upscaled.png"],
            ["Hermit crab","e+/bugs/Hermit_Crab_DnMe+_Icon_Upscaled.png"],
            ["Coconut crab","e+/bugs/Coconut_Crab_DnMe+_Icon_Upscaled.png"],
            ["Ant","gc/bugs/Ant_PG_Icon_Upscaled.png"],
            ["Dung beetle","e+/bugs/Dung_Beetle_DnMe+_Icon_Upscaled.png"],
            ["Cockroach","gc/bugs/Cockroach_PG_Icon_Upscaled.png"],
        ],
        fish: [
            ["Crucian carp","gc/fish/Crucian_Carp_PG_Icon_Upscaled.png"],
            ["Brook trout","gc/fish/Brook_Trout_PG_Icon_Upscaled.png"],
            ["Carp","gc/fish/Carp_PG_Icon_Upscaled.png"],
            ["Koi","gc/fish/Koi_PG_Icon_Upscaled.png"],
            ["Barbel steed","gc/fish/Barbel_Steed_PG_Icon_Upscaled.png"],
            ["Dace","gc/fish/Dace_PG_Icon_Upscaled.png"],
            ["Catfish","gc/fish/Catfish_PG_Icon_Upscaled.png"],
            ["Giant catfish","gc/fish/Giant_Catfish_PG_Icon_Upscaled.png"],
            ["Pale chub","gc/fish/Pale_Chub_PG_Icon_Upscaled.png"],
            ["Bitterling","gc/fish/Bitterling_PG_Icon_Upscaled.png"],
            ["Loach","gc/fish/Loach_PG_Icon_Upscaled.png"],
            ["Bluegill","gc/fish/Bluegill_PG_Icon_Upscaled.png"],
            ["Small bass","gc/fish/Small_Bass_PG_Icon_Upscaled.png"],
            ["Bass","gc/fish/Bass_PG_Inv_Icon_Upscaled.png"],
            ["Large bass","gc/fish/Large_Bass_PG_Icon_Upscaled.png"],
            ["Giant snakehead","gc/fish/Giant_Snakehead_PG_Icon_Upscaled.png"],
            ["Eel","gc/fish/Eel_PG_Icon_Upscaled.png"],
            ["Freshwater goby","gc/fish/Freshwater_Goby_PG_Icon_Upscaled.png"],
            ["Pond smelt","gc/fish/Pond_Smelt_PG_Icon_Upscaled.png"],
            ["Sweetfish","gc/fish/Sweetfish_PG_Icon_Upscaled.png"],
            ["Cherry salmon","gc/fish/Cherry_Salmon_PG_Icon_Upscaled.png"],
            ["Rainbow trout","gc/fish/Rainbow_Trout_PG_Icon_Upscaled.png"],
            ["Large char","gc/fish/Large_Char_PG_Icon_Upscaled.png"],
            ["Stringfish","gc/fish/Stringfish_PG_Icon_Upscaled.png"],
            ["Salmon","gc/fish/Salmon_PG_Icon_Upscaled.png"],
            ["Goldfish","gc/fish/Goldfish_PG_Icon_Upscaled.png"],
            ["Popeyed goldfish","gc/fish/Popeyed_Goldfish_PG_Icon_Upscaled.png"],
            ["Guppy","gc/fish/Guppy_PG_Icon_Upscaled.png"],
            ["Angelfish","gc/fish/Angelfish_PG_Icon_Upscaled.png"],
            ["Piranha","gc/fish/Piranha_PG_Icon_Upscaled.png"],
            ["Arowana","gc/fish/Arowana_PG_Icon_Upscaled.png"],
            ["Arapaima","gc/fish/Arapaima_PG_Icon_Upscaled.png"],
            ["Crawfish","gc/fish/Crawfish_PG_Icon_Upscaled.png"],
            ["Frog","gc/fish/Frog_PG_Icon_Upscaled.png"],
            ["Killifish","gc/fish/Killifish_PG_Icon_Upscaled.png"],
            ["Jellyfish","gc/fish/Jellyfish_PG_Icon_Upscaled.png"],
            ["Sea bass","gc/fish/Sea_Bass_PG_Icon_Upscaled.png"],
            ["Horse mackerel","e+/fish/Horse_Mackerel_DnMe+_Icon_Upscaled.png"],
            ["Red snapper","gc/fish/Red_Snapper_PG_Icon_Upscaled.png"],
            ["Barred knifejaw","gc/fish/Barred_Knifejaw_PG_Icon_Upscaled.png"],
            ["Balloonfish","e+/fish/Balloonfish_DnMe+_Icon_Upscaled.png"],
            ["Dab","e+/fish/Dab_DnMe+_Icon_Upscaled.png"],
            ["Olive flounder","e+/fish/Olive_Flounder_DnMe+_Icon_Upscaled.png"],
            ["Squid","e+/fish/Squid_DnMe+_Icon_Upscaled.png"],
            ["Octopus","e+/fish/Octopus_DnMe+_Icon_Upscaled.png"],
            ["Seahorse","e+/fish/Seahorse_DnMe+_Icon_Upscaled.png"],
            ["Blue marlin","e+/fish/Blue_Marlin_DnMe+_Icon_Upscaled.png"],
            ["Coelacanth","gc/fish/Coelacanth_PG_Icon_Upscaled.png"],
        ],
    },

    // ── GameCube ──────────────────────────────────────────────────────────────
    gc: {
        bugs: [
            ["Common butterfly","Common_Butterfly_PG_Icon_Upscaled.png"],
            ["Yellow butterfly","Yellow_Butterfly_PG_Icon_Upscaled.png"],
            ["Tiger butterfly","Tiger_Butterfly_PG_Icon_Upscaled.png"],
            ["Purple butterfly","Purple_Butterfly_PG_Icon_Upscaled.png"],
            ["Brown cicada","Brown_Cicada_PG_Icon_Upscaled.png"],
            ["Robust cicada","Robust_Cicada_PG_Icon_Upscaled.png"],
            ["Walker cicada","Walker_Cicada_PG_Icon_Upscaled.png"],
            ["Evening cicada","Evening_Cicada_PG_Icon_Upscaled.png"],
            ["Red dragonfly","Red_Dragonfly_PG_Icon_Upscaled.png"],
            ["Common dragonfly","Common_Dragonfly_PG_Icon_Upscaled.png"],
            ["Darner dragonfly","Darner_Dragonfly_PG_Icon_Upscaled.png"],
            ["Banded dragonfly","Banded_Dragonfly_PG_Icon_Upscaled.png"],
            ["Cricket","Cricket_PG_Icon_Upscaled.png"],
            ["Grasshopper","Grasshopper_PG_Icon_Upscaled.png"],
            ["Pine cricket","Pine_Cricket_PG_Icon_Upscaled.png"],
            ["Bell cricket","Bell_Cricket_PG_Icon_Upscaled.png"],
            ["Ladybug","Ladybug_PG_Icon_Upscaled.png"],
            ["Spotted ladybug","Spotted_Ladybug_PG_Icon_Upscaled.png"],
            ["Mantis","Mantis_PG_Icon_Upscaled.png"],
            ["Long locust","Long_Locust_PG_Icon_Upscaled.png"],
            ["Migratory locust","Migratory_Locust_PG_Icon_Upscaled.png"],
            ["Cockroach","Cockroach_PG_Icon_Upscaled.png"],
            ["Bee","Bee_PG_Icon_Upscaled.png"],
            ["Firefly","Firefly_PG_Icon_Upscaled.png"],
            ["Drone beetle","Drone_Beetle_PG_Icon_Upscaled.png"],
            ["Longhorn beetle","Longhorn_Beetle_PG_Icon_Upscaled.png"],
            ["Jewel beetle","Jewel_Beetle_PG_Icon_Upscaled.png"],
            ["Dynastid beetle","Dynastid_Beetle_PG_Icon_Upscaled.png"],
            ["Flat stag beetle","Flat_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Saw stag beetle","Saw_Stag_Beetle_PG_Icon_Upscaled.png"],
            ["Mountain beetle","Mountain_Beetle_PG_Icon_Upscaled.png"],
            ["Giant beetle","Giant_Beetle_PG_Icon_Upscaled.png"],
            ["Pond skater","Pond_Skater_PG_Icon_Upscaled.png"],
            ["Ant","Ant_PG_Icon_Upscaled.png"],
            ["Pill bug","Pill_Bug_PG_Icon_Upscaled.png"],
            ["Mosquito","Mosquito_PG_Icon_Upscaled.png"],
            ["Mole cricket","Mole_Cricket_PG_Icon_Upscaled.png"],
            ["Spider","Spider_PG_Icon_Upscaled.png"],
            ["Snail","Snail_PG_Icon_Upscaled.png"],
            ["Bagworm","Bagworm_PG_Icon_Upscaled.png"],
        ],
        fish: [
            ["Crucian carp","Crucian_Carp_PG_Icon_Upscaled.png"],
            ["Brook trout","Brook_Trout_PG_Icon_Upscaled.png"],
            ["Carp","Carp_PG_Icon_Upscaled.png"],
            ["Koi","Koi_PG_Icon_Upscaled.png"],
            ["Barbel steed","Barbel_Steed_PG_Icon_Upscaled.png"],
            ["Dace","Dace_PG_Icon_Upscaled.png"],
            ["Catfish","Catfish_PG_Icon_Upscaled.png"],
            ["Giant catfish","Giant_Catfish_PG_Icon_Upscaled.png"],
            ["Pale chub","Pale_Chub_PG_Icon_Upscaled.png"],
            ["Bitterling","Bitterling_PG_Icon_Upscaled.png"],
            ["Loach","Loach_PG_Icon_Upscaled.png"],
            ["Bluegill","Bluegill_PG_Icon_Upscaled.png"],
            ["Small bass","Small_Bass_PG_Icon_Upscaled.png"],
            ["Bass","Bass_PG_Inv_Icon_Upscaled.png"],
            ["Large bass","Large_Bass_PG_Icon_Upscaled.png"],
            ["Giant snakehead","Giant_Snakehead_PG_Icon_Upscaled.png"],
            ["Eel","Eel_PG_Icon_Upscaled.png"],
            ["Freshwater goby","Freshwater_Goby_PG_Icon_Upscaled.png"],
            ["Pond smelt","Pond_Smelt_PG_Icon_Upscaled.png"],
            ["Sweetfish","Sweetfish_PG_Icon_Upscaled.png"],
            ["Cherry salmon","Cherry_Salmon_PG_Icon_Upscaled.png"],
            ["Rainbow trout","Rainbow_Trout_PG_Icon_Upscaled.png"],
            ["Large char","Large_Char_PG_Icon_Upscaled.png"],
            ["Stringfish","Stringfish_PG_Icon_Upscaled.png"],
            ["Salmon","Salmon_PG_Icon_Upscaled.png"],
            ["Goldfish","Goldfish_PG_Icon_Upscaled.png"],
            ["Popeyed goldfish","Popeyed_Goldfish_PG_Icon_Upscaled.png"],
            ["Guppy","Guppy_PG_Icon_Upscaled.png"],
            ["Angelfish","Angelfish_PG_Icon_Upscaled.png"],
            ["Piranha","Piranha_PG_Icon_Upscaled.png"],
            ["Arowana","Arowana_PG_Icon_Upscaled.png"],
            ["Coelacanth","Coelacanth_PG_Icon_Upscaled.png"],
            ["Crawfish","Crawfish_PG_Icon_Upscaled.png"],
            ["Frog","Frog_PG_Icon_Upscaled.png"],
            ["Killifish","Killifish_PG_Icon_Upscaled.png"],
            ["Jellyfish","Jellyfish_PG_Icon_Upscaled.png"],
            ["Sea bass","Sea_Bass_PG_Icon_Upscaled.png"],
            ["Red snapper","Red_Snapper_PG_Icon_Upscaled.png"],
            ["Barred knifejaw","Barred_Knifejaw_PG_Icon_Upscaled.png"],
            ["Arapaima","Arapaima_PG_Icon_Upscaled.png"],
        ],
    },

    // ── Wild World ────────────────────────────────────────────────────────────
    ww: {
        bugs: [
            ["Common butterfly","Common_Butterfly_WW_Inv_Icon.png"],
            ["Yellow butterfly","Yellow_Butterfly_WW_Inv_Icon.png"],
            ["Tiger butterfly","Tiger_Butterfly_WW_Inv_Icon.png"],
            ["Peacock","Peacock_WW_Inv_Icon.png"],
            ["Monarch","Monarch_WW_Inv_Icon.png"],
            ["Emperor","Emperor_WW_Inv_Icon.png"],
            ["Agrias butterfly","Agrias_Butterfly_WW_Inv_Icon.png"],
            ["Birdwing","Birdwing_WW_Inv_Icon.png"],
            ["Moth","Moth_WW_Inv_Icon.png"],
            ["Oak silk moth","Oak_Silk_Moth_WW_Inv_Icon.png"],
            ["Honeybee","Honeybee_WW_Inv_Icon.png"],
            ["Bee","Bee_WW_Inv_Icon.png"],
            ["Long locust","Long_Locust_WW_Inv_Icon.png"],
            ["Migratory locust","Migratory_Locust_WW_Inv_Icon.png"],
            ["Mantis","Mantis_WW_Inv_Icon.png"],
            ["Orchid mantis","Orchid_Mantis_WW_Inv_Icon.png"],
            ["Brown cicada","Brown_Cicada_WW_Inv_Icon.png"],
            ["Robust cicada","Robust_Cicada_WW_Inv_Icon.png"],
            ["Walker cicada","Walker_Cicada_WW_Inv_Icon.png"],
            ["Evening cicada","Evening_Cicada_WW_Inv_Icon.png"],
            ["Lantern fly","Lantern_Fly_WW_Inv_Icon.png"],
            ["Red dragonfly","Red_Dragonfly_WW_Inv_Icon.png"],
            ["Darner dragonfly","Darner_Dragonfly_WW_Inv_Icon.png"],
            ["Banded dragonfly","Banded_Dragonfly_WW_Inv_Icon.png"],
            ["Ant","Ant_WW_Inv_Icon.png"],
            ["Pondskater","Pondskater_WW_Inv_Icon.png"],
            ["Snail","Snail_WW_Inv_Icon.png"],
            ["Cricket","Cricket_WW_Inv_Icon.png"],
            ["Bell cricket","Bell_Cricket_WW_Inv_Icon.png"],
            ["Grasshopper","Grasshopper_WW_Inv_Icon.png"],
            ["Mole cricket","Mole_Cricket_WW_Inv_Icon.png"],
            ["Walkingstick","Walkingstick_WW_Inv_Icon.png"],
            ["Ladybug","Ladybug_WW_Inv_Icon.png"],
            ["Fruit beetle","Fruit_Beetle_WW_Inv_Icon.png"],
            ["Scarab beetle","Scarab_Beetle_WW_Inv_Icon.png"],
            ["Dung beetle","Dung_Beetle_WW_Inv_Icon.png"],
            ["Goliath beetle","Goliath_Beetle_WW_Inv_Icon.png"],
            ["Firefly","Firefly_WW_Inv_Icon.png"],
            ["Jewel beetle","Jewel_Beetle_WW_Inv_Icon.png"],
            ["Longhorn beetle","Longhorn_Beetle_WW_Inv_Icon.png"],
            ["Saw stag beetle","Saw_Stag_Beetle_WW_Inv_Icon.png"],
            ["Stag beetle","Stag_Beetle_WW_Inv_Icon.png"],
            ["Giant beetle","Giant_Beetle_WW_Inv_Icon.png"],
            ["Rainbow stag","Rainbow_Stag_WW_Inv_Icon.png"],
            ["Dynastid beetle","Dynastid_Beetle_WW_Inv_Icon.png"],
            ["Atlas beetle","Atlas_Beetle_WW_Inv_Icon.png"],
            ["Elephant beetle","Elephant_Beetle_WW_Inv_Icon.png"],
            ["Hercules beetle","Hercules_Beetle_WW_Inv_Icon.png"],
            ["Flea","Flea_WW_Inv_Icon.png"],
            ["Pill bug","Pill_Bug_WW_Inv_Icon.png"],
            ["Mosquito","Mosquito_WW_Inv_Icon.png"],
            ["Fly","Fly_WW_Inv_Icon.png"],
            ["Cockroach","Cockroach_WW_Inv_Icon.png"],
            ["Spider","Spider_WW_Inv_Icon.png"],
            ["Tarantula","Tarantula_WW_Inv_Icon.png"],
            ["Scorpion","Scorpion_WW_Inv_Icon.png"],
        ],
        fish: [
            ["Bitterling","Bitterling_WW_Inv_Icon.png"],
            ["Pale chub","Pale_Chub_WW_Inv_Icon.png"],
            ["Crucian carp","Crucian_Carp_WW_Inv_Icon.png"],
            ["Dace","Dace_WW_Inv_Icon.png"],
            ["Barbel steed","Barbel_Steed_WW_Inv_Icon.png"],
            ["Carp","Carp_WW_Inv_Icon.png"],
            ["Koi","Koi_WW_Inv_Icon.png"],
            ["Goldfish","Goldfish_WW_Inv_Icon.png"],
            ["Popeyed goldfish","Popeyed_Goldfish_WW_Inv_Icon.png"],
            ["Killifish","Killifish_WW_Inv_Icon.png"],
            ["Crawfish","Crawfish_WW_Inv_Icon.png"],
            ["Frog","Frog_WW_Inv_Icon.png"],
            ["Freshwater goby","Freshwater_Goby_WW_Inv_Icon.png"],
            ["Loach","Loach_WW_Inv_Icon.png"],
            ["Catfish","Catfish_WW_Inv_Icon.png"],
            ["Eel","Eel_WW_Inv_Icon.png"],
            ["Giant snakehead","Giant_Snakehead_WW_Inv_Icon.png"],
            ["Bluegill","Bluegill_WW_Inv_Icon.png"],
            ["Yellow perch","Yellow_Perch_WW_Inv_Icon.png"],
            ["Black bass","Black_Bass_WW_Inv_Icon.png"],
            ["Pond smelt","Pond_Smelt_WW_Inv_Icon.png"],
            ["Sweetfish","Sweetfish_WW_Inv_Icon.png"],
            ["Cherry salmon","Cherry_Salmon_WW_Inv_Icon.png"],
            ["Char","Char_WW_Inv_Icon.png"],
            ["Rainbow trout","Rainbow_Trout_WW_Inv_Icon.png"],
            ["Stringfish","Stringfish_WW_Inv_Icon.png"],
            ["Salmon","Salmon_WW_Inv_Icon.png"],
            ["King salmon","King_Salmon_WW_Inv_Icon.png"],
            ["Guppy","Guppy_WW_Inv_Icon.png"],
            ["Angelfish","Angelfish_WW_Inv_Icon.png"],
            ["Piranha","Piranha_WW_Inv_Icon.png"],
            ["Arowana","Arowana_WW_Inv_Icon.png"],
            ["Dorado","Dorado_WW_Inv_Icon.png"],
            ["Gar","Gar_WW_Inv_Icon.png"],
            ["Arapaima","Arapaima_WW_Inv_Icon.png"],
            ["Sea butterfly","Sea_Butterfly_WW_Inv_Icon.png"],
            ["Jellyfish","Jellyfish_WW_Inv_Icon.png"],
            ["Seahorse","Seahorse_WW_Inv_Icon.png"],
            ["Clownfish","Clownfish_WW_Inv_Icon.png"],
            ["Zebra turkeyfish","Zebra_Turkeyfish_WW_Inv_Icon.png"],
            ["Puffer fish","Puffer_Fish_WW_Inv_Icon.png"],
            ["Horse mackerel","Horse_Mackerel_WW_Inv_Icon.png"],
            ["Barred knifejaw","Barred_Knifejaw_WW_Inv_Icon.png"],
            ["Sea bass","Sea_Bass_WW_Inv_Icon.png"],
            ["Red snapper","Red_Snapper_WW_Inv_Icon.png"],
            ["Dab","Dab_WW_Inv_Icon.png"],
            ["Olive flounder","Olive_Flounder_WW_Inv_Icon.png"],
            ["Squid","Squid_WW_Inv_Icon.png"],
            ["Octopus","Octopus_WW_Inv_Icon.png"],
            ["Football fish","Football_Fish_WW_Inv_Icon.png"],
            ["Tuna","Tuna_WW_Inv_Icon.png"],
            ["Blue marlin","Blue_Marlin_WW_Inv_Icon.png"],
            ["Ocean sunfish","Ocean_Sunfish_WW_Inv_Icon.png"],
            ["Hammerhead shark","Hammerhead_Shark_WW_Inv_Icon.png"],
            ["Shark","Shark_WW_Inv_Icon.png"],
            ["Coelacanth","Coelacanth_WW_Inv_Icon.png"],
        ],
    },

    // ── City Folk ─────────────────────────────────────────────────────────────
    cf: {
        bugs: [
            ["Common butterfly","Common_Butterfly_CF_Icon.png"],
            ["Yellow butterfly","Yellow_Butterfly_CF_Icon.png"],
            ["Tiger butterfly","Tiger_Butterfly_CF_Icon.png"],
            ["Peacock","Peacock_CF_Icon.png"],
            ["Monarch","Monarch_CF_Icon.png"],
            ["Emperor","Emperor_CF_Icon.png"],
            ["Agrias butterfly","Agrias_Butterfly_CF_Icon.png"],
            ["Raja Brooke","Raja_Brooke_CF_Icon.png"],
            ["Birdwing","Birdwing_CF_Icon.png"],
            ["Moth","Moth_CF_Icon.png"],
            ["Oak silk moth","Oak_Silk_Moth_CF_Icon.png"],
            ["Honeybee","Honeybee_CF_Icon.png"],
            ["Bee","Bee_CF_Icon.png"],
            ["Long locust","Long_Locust_CF_Icon.png"],
            ["Migratory locust","Migratory_Locust_CF_Icon.png"],
            ["Mantis","Mantis_CF_Icon.png"],
            ["Orchid mantis","Orchid_Mantis_CF_Icon.png"],
            ["Brown cicada","Brown_Cicada_CF_Icon.png"],
            ["Robust cicada","Robust_Cicada_CF_Icon.png"],
            ["Walker cicada","Walker_Cicada_CF_Icon.png"],
            ["Evening cicada","Evening_Cicada_CF_Icon.png"],
            ["Lantern fly","Lantern_Fly_CF_Icon.png"],
            ["Red dragonfly","Red_Dragonfly_CF_Icon.png"],
            ["Darner dragonfly","Darner_Dragonfly_CF_Icon.png"],
            ["Banded dragonfly","Banded_Dragonfly_CF_Icon.png"],
            ["Giant Petaltail","Giant_Petaltail_CF_Icon.png"],
            ["Ant","Ant_CF_Icon.png"],
            ["Pondskater","Pondskater_CF_Icon.png"],
            ["Diving beetle","Diving_Beetle_CF_Icon.png"],
            ["Snail","Snail_CF_Icon.png"],
            ["Cricket","Cricket_CF_Icon.png"],
            ["Bell cricket","Bell_Cricket_CF_Icon.png"],
            ["Grasshopper","Grasshopper_CF_Icon.png"],
            ["Mole cricket","Mole_Cricket_CF_Icon.png"],
            ["Walking leaf","Walking_Leaf_CF_Icon.png"],
            ["Walkingstick","Walkingstick_CF_Icon.png"],
            ["Bagworm","Bagworm_CF_Icon.png"],
            ["Ladybug","Ladybug_CF_Icon.png"],
            ["Violin beetle","Violin_Beetle_CF_Icon.png"],
            ["Longhorn beetle","Longhorn_Beetle_CF_Icon.png"],
            ["Dung beetle","Dung_Beetle_CF_Icon.png"],
            ["Firefly","Firefly_CF_Icon.png"],
            ["Fruit beetle","Fruit_Beetle_CF_Icon.png"],
            ["Scarab beetle","Scarab_Beetle_CF_Icon.png"],
            ["Jewel beetle","Jewel_Beetle_CF_Icon.png"],
            ["Miyama Stag Beetle","Miyama_Stag_CF_Icon.png"],
            ["Saw Stag Beetle","Saw_Stag_CF_Icon.png"],
            ["Giant beetle","Giant_Beetle_CF_Icon.png"],
            ["Rainbow stag","Rainbow_Stag_CF_Icon.png"],
            ["Cyclommatus","Cyclommatus_CF_Icon.png"],
            ["Golden stag","Golden_Stag_CF_Icon.png"],
            ["Atlas beetle","Atlas_Beetle_CF_Icon.png"],
            ["Dynastid beetle","Dynastid_Beetle_CF_Icon.png"],
            ["Elephant beetle","Elephant_Beetle_CF_Icon.png"],
            ["Hercules beetle","Hercules_Beetle_CF_Icon.png"],
            ["Goliath beetle","Goliath_Beetle_CF_Icon.png"],
            ["Flea","Flea_CF_Icon.png"],
            ["Pill bug","Pill_Bug_CF_Icon.png"],
            ["Mosquito","Mosquito_CF_Icon.png"],
            ["Fly","Fly_CF_Icon.png"],
            ["Centipede","Centipede_CF_Icon.png"],
            ["Spider","Spider_CF_Icon.png"],
            ["Tarantula","Tarantula_CF_Icon.png"],
            ["Scorpion","Scorpion_CF_Icon.png"],
        ],
        fish: [
            ["Bitterling","Bitterling_CF_Icon.png"],
            ["Pale chub","Pale_Chub_CF_Icon.png"],
            ["Crucian carp","Crucian_Carp_CF_Icon.png"],
            ["Dace","Dace_CF_Icon.png"],
            ["Barbel steed","Barbel_Steed_CF_Icon.png"],
            ["Carp","Carp_CF_Icon.png"],
            ["Koi","Koi_CF_Icon.png"],
            ["Goldfish","Goldfish_CF_Icon.png"],
            ["Popeyed goldfish","Popeyed_Goldfish_CF_Icon.png"],
            ["Killifish","Killifish_CF_Icon.png"],
            ["Crawfish","Crawfish_CF_Icon.png"],
            ["Frog","Frog_CF_Icon.png"],
            ["Freshwater goby","Freshwater_Goby_CF_Icon.png"],
            ["Loach","Loach_CF_Icon.png"],
            ["Catfish","Catfish_CF_Icon.png"],
            ["Eel","Eel_CF_Icon.png"],
            ["Giant snakehead","Giant_Snakehead_CF_Icon.png"],
            ["Bluegill","Bluegill_CF_Icon.png"],
            ["Yellow perch","Yellow_Perch_CF_Icon.png"],
            ["Black bass","Black_Bass_CF_Icon.png"],
            ["Pike","Pike_CF_Icon.png"],
            ["Pond smelt","Pond_Smelt_CF_Icon.png"],
            ["Sweetfish","Sweetfish_CF_Icon.png"],
            ["Cherry salmon","Cherry_Salmon_CF_Icon.png"],
            ["Char","Char_CF_Icon.png"],
            ["Rainbow trout","Rainbow_Trout_CF_Icon.png"],
            ["Stringfish","Stringfish_CF_Icon.png"],
            ["Salmon","Salmon_CF_Icon.png"],
            ["King salmon","King_Salmon_CF_Icon.png"],
            ["Guppy","Guppy_CF_Icon.png"],
            ["Angelfish","Angelfish_CF_Icon.png"],
            ["Neon tetra","Neon_Tetra_CF_Icon.png"],
            ["Piranha","Piranha_CF_Icon.png"],
            ["Arowana","Arowana_CF_Icon.png"],
            ["Dorado","Dorado_CF_Icon.png"],
            ["Gar","Gar_CF_Icon.png"],
            ["Arapaima","Arapaima_CF_Icon.png"],
            ["Sea butterfly","Sea_Butterfly_CF_Icon.png"],
            ["Jellyfish","Jellyfish_CF_Icon.png"],
            ["Sea horse","Sea_Horse_CF_Icon.png"],
            ["Clownfish","Clownfish_CF_Icon.png"],
            ["Surgeonfish","Surgeonfish_CF_Icon.png"],
            ["Butterflyfish","Butterfly_Fish_CF_Icon.png"],
            ["Napoleonfish","Napoleonfish_CF_Icon.png"],
            ["Zebra turkeyfish","Zebra_Turkeyfish_CF_Icon.png"],
            ["Puffer fish","Puffer_Fish_CF_Icon.png"],
            ["Horse mackerel","Horse_Mackerel_CF_Icon.png"],
            ["Barred knifejaw","Barred_Knifejaw_CF_Icon.png"],
            ["Sea bass","Sea_Bass_CF_Icon.png"],
            ["Red snapper","Red_Snapper_CF_Icon.png"],
            ["Dab","Dab_CF_Icon.png"],
            ["Olive flounder","Olive_Flounder_CF_Icon.png"],
            ["Squid","Squid_CF_Icon.png"],
            ["Octopus","Octopus_CF_Icon.png"],
            ["Lobster","Lobster_CF_Icon.png"],
            ["Moray eel","Moray_Eel_CF_Icon.png"],
            ["Football fish","Football_Fish_CF_Icon.png"],
            ["Tuna","Tuna_CF_Icon.png"],
            ["Blue marlin","Blue_Marlin_CF_Icon.png"],
            ["Ray","Ray_CF_Icon.png"],
            ["Ocean sunfish","Ocean_Sunfish_CF_Icon.png"],
            ["Hammerhead shark","Hammerhead_Shark_CF_Icon.png"],
            ["Shark","Shark_CF_Icon.png"],
            ["Coelacanth","Coelacanth_CF_Icon.png"],
        ],
    },

    // ── New Leaf ──────────────────────────────────────────────────────────────
    nl: {
        bugs: [
            ["Common butterfly","Common_Butterfly_NL_Icon.png"],
            ["Yellow butterfly","Yellow_Butterfly_NL_Icon.png"],
            ["Tiger butterfly","Tiger_Butterfly_NL_Icon.png"],
            ["Peacock butterfly","Peacock_Butterfly_NL_Icon.png"],
            ["Monarch butterfly","Monarch_Butterfly_NL_Icon.png"],
            ["Emperor butterfly","Emperor_Butterfly_NL_Icon.png"],
            ["Agrias butterfly","Agrias_Butterfly_NL_Icon.png"],
            ["Raja B. Butterfly","Raja_B_Butterfly_NL_Icon.png"],
            ["Birdwing butterfly","Birdwing_Butterfly_NL_Icon.png"],
            ["Moth","Moth_NL_Icon.png"],
            ["Oak silk moth","Oak_Silk_Moth_NL_Icon.png"],
            ["Honeybee","Honeybee_NL_Icon.png"],
            ["Bee","Bee_NL_Icon.png"],
            ["Long locust","Long_Locust_NL_Icon.png"],
            ["Migratory locust","Migratory_Locust_NL_Icon.png"],
            ["Rice grasshopper","Rice_Grasshopper_NL_Icon.png"],
            ["Mantis","Mantis_NL_Icon.png"],
            ["Orchid mantis","Orchid_Mantis_NL_Icon.png"],
            ["Brown cicada","Brown_Cicada_NL_Icon.png"],
            ["Robust cicada","Robust_Cicada_NL_Icon.png"],
            ["Giant cicada","Giant_Cicada_NL_Icon.png"],
            ["Walker cicada","Walker_Cicada_NL_Icon.png"],
            ["Evening cicada","Evening_Cicada_NL_Icon.png"],
            ["Cicada shell","Cicada_Shell_NL_Icon.png"],
            ["Lantern fly","Lantern_Fly_NL_Icon.png"],
            ["Red dragonfly","Red_Dragonfly_NL_Icon.png"],
            ["Darner dragonfly","Darner_Dragonfly_NL_Icon.png"],
            ["Banded dragonfly","Banded_Dragonfly_NL_Icon.png"],
            ["Petaltail dragonfly","Petaltail_Dragonfly_NL_Icon.png"],
            ["Ant","Ant_NL_Icon.png"],
            ["Pondskater","Pondskater_NL_Icon.png"],
            ["Diving beetle","Diving_Beetle_NL_Icon.png"],
            ["Stinkbug","Stinkbug_NL_Icon.png"],
            ["Snail","Snail_NL_Icon.png"],
            ["Cricket","Cricket_NL_Icon.png"],
            ["Bell cricket","Bell_Cricket_NL_Icon.png"],
            ["Grasshopper","Grasshopper_NL_Icon.png"],
            ["Mole cricket","Mole_Cricket_NL_Icon.png"],
            ["Walking leaf","Walking_Leaf_NL_Icon.png"],
            ["Walking stick","Walking_Stick_NL_Icon.png"],
            ["Bagworm","Bagworm_NL_Icon.png"],
            ["Ladybug","Ladybug_NL_Icon.png"],
            ["Violin beetle","Violin_Beetle_NL_Icon.png"],
            ["Longhorn beetle","Longhorn_Beetle_NL_Icon.png"],
            ["Tiger beetle","Tiger_Beetle_NL_Icon.png"],
            ["Dung beetle","Dung_Beetle_NL_Icon.png"],
            ["Wharf roach","Wharf_Roach_NL_Icon.png"],
            ["Hermit crab","Hermit_Crab_NL_Icon.png"],
            ["Firefly","Firefly_NL_Icon.png"],
            ["Fruit beetle","Fruit_Beetle_NL_Icon.png"],
            ["Scarab beetle","Scarab_Beetle_NL_Icon.png"],
            ["Jewel beetle","Jewel_Beetle_NL_Icon.png"],
            ["Miyama stag","Miyama_Stag_NL_Icon.png"],
            ["Saw stag","Saw_Stag_NL_Icon.png"],
            ["Giant stag","Giant_Stag_NL_Icon.png"],
            ["Rainbow stag","Rainbow_Stag_NL_Icon.png"],
            ["Cyclommatus stag","Cyclommatus_Stag_NL_Icon.png"],
            ["Golden stag","Golden_Stag_NL_Icon.png"],
            ["Horned dynastid","Horned_Dynastid_NL_Icon.png"],
            ["Horned atlas","Horned_Atlas_NL_Icon.png"],
            ["Horned elephant","Horned_Elephant_NL_Icon.png"],
            ["Horned hercules","Horned_Hercules_NL_Icon.png"],
            ["Goliath beetle","Goliath_Beetle_NL_Icon.png"],
            ["Flea","Flea_NL_Icon.png"],
            ["Pill bug","Pill_Bug_NL_Icon.png"],
            ["Mosquito","Mosquito_NL_Icon.png"],
            ["Fly","Fly_NL_Icon.png"],
            ["House centipede","House_Centipede_NL_Icon.png"],
            ["Centipede","Centipede_NL_Icon.png"],
            ["Spider","Spider_NL_Icon.png"],
            ["Tarantula","Tarantula_NL_Icon.png"],
            ["Scorpion","Scorpion_NL_Icon.png"],
        ],
        fish: [
            ["Bitterling","Bitterling_NL_Icon.png"],
            ["Pale chub","Pale_Chub_NL_Icon.png"],
            ["Crucian carp","Crucian_Carp_NL_Icon.png"],
            ["Dace","Dace_NL_Icon.png"],
            ["Barbel steed","Barbel_Steed_NL_Icon.png"],
            ["Carp","Carp_NL_Icon.png"],
            ["Koi","Koi_NL_Icon.png"],
            ["Goldfish","Goldfish_NL_Icon.png"],
            ["Pop-eyed goldfish","Pop-Eyed_Goldfish_NL_Icon.png"],
            ["Killifish","Killifish_NL_Icon.png"],
            ["Crawfish","Crawfish_NL_Icon.png"],
            ["Soft-shelled turtle","Soft-Shelled_Turtle_NL_Icon.png"],
            ["Tadpole","Tadpole_NL_Icon.png"],
            ["Frog","Frog_NL_Icon.png"],
            ["Freshwater goby","Freshwater_Goby_NL_Icon.png"],
            ["Loach","Loach_NL_Icon.png"],
            ["Catfish","Catfish_NL_Icon.png"],
            ["Eel","Eel_NL_Icon.png"],
            ["Giant snakehead","Giant_Snakehead_NL_Icon.png"],
            ["Bluegill","Bluegill_NL_Icon.png"],
            ["Yellow perch","Yellow_Perch_NL_Icon.png"],
            ["Black bass","Black_Bass_NL_Icon.png"],
            ["Pike","Pike_NL_Icon.png"],
            ["Pond smelt","Pond_Smelt_NL_Icon.png"],
            ["Sweetfish","Sweetfish_NL_Icon.png"],
            ["Cherry salmon","Cherry_Salmon_NL_Icon.png"],
            ["Char","Char_NL_Icon.png"],
            ["Rainbow trout","Rainbow_Trout_NL_Icon.png"],
            ["Stringfish","Stringfish_NL_Icon.png"],
            ["Salmon","Salmon_NL_Icon.png"],
            ["King salmon","King_Salmon_NL_Icon.png"],
            ["Mitten crab","Mitten_Crab_NL_Icon.png"],
            ["Guppy","Guppy_NL_Icon.png"],
            ["Nibble fish","Nibble_Fish_NL_Icon.png"],
            ["Angelfish","Angelfish_NL_Icon.png"],
            ["Neon tetra","Neon_Tetra_NL_Icon.png"],
            ["Piranha","Piranha_NL_Icon.png"],
            ["Arowana","Arowana_NL_Icon.png"],
            ["Dorado","Dorado_NL_Icon.png"],
            ["Gar","Gar_NL_Icon.png"],
            ["Arapaima","Arapaima_NL_Icon.png"],
            ["Saddled bichir","Saddled_Bichir_NL_Icon.png"],
            ["Sea butterfly","Sea_Butterfly_NL_Icon.png"],
            ["Sea horse","Sea_Horse_NL_Icon.png"],
            ["Clown fish","Clown_Fish_NL_Icon.png"],
            ["Surgeonfish","Surgeonfish_NL_Icon.png"],
            ["Butterfly fish","Butterfly_Fish_NL_Icon.png"],
            ["Napoleonfish","Napoleonfish_NL_Icon.png"],
            ["Zebra turkeyfish","Zebra_Turkeyfish_NL_Icon.png"],
            ["Blowfish","Blowfish_NL_Icon.png"],
            ["Puffer fish","Puffer_Fish_NL_Icon.png"],
            ["Horse mackerel","Horse_Mackerel_NL_Icon.png"],
            ["Barred knifejaw","Barred_Knifejaw_NL_Icon.png"],
            ["Sea bass","Sea_Bass_NL_Icon.png"],
            ["Red snapper","Red_Snapper_NL_Icon.png"],
            ["Dab","Dab_NL_Icon.png"],
            ["Olive flounder","Olive_Flounder_NL_Icon.png"],
            ["Squid","Squid_NL_Icon.png"],
            ["Moray eel","Moray_Eel_NL_Icon.png"],
            ["Ribbon eel","Ribbon_Eel_NL_Icon.png"],
            ["Football fish","Football_Fish_NL_Icon.png"],
            ["Tuna","Tuna_NL_Icon.png"],
            ["Blue marlin","Blue_Marlin_NL_Icon.png"],
            ["Giant trevally","Giant_Trevally_NL_Icon.png"],
            ["Ray","Ray_NL_Icon.png"],
            ["Ocean sunfish","Ocean_Sunfish_NL_Icon.png"],
            ["Hammerhead shark","Hammerhead_Shark_NL_Icon.png"],
            ["Shark","Shark_NL_Icon.png"],
            ["Saw shark","Saw_Shark_NL_Icon.png"],
            ["Whale shark","Whale_Shark_NL_Icon.png"],
            ["Oarfish","Oarfish_NL_Icon.png"],
            ["Coelacanth","Coelacanth_NL_Icon.png"],
        ],
        sea: [
            ["Seaweed","Seaweed_NL_Icon.png"],
            ["Sea grapes","Sea_Grapes_NL_Icon.png"],
            ["Sea urchin","Sea_Urchin_NL_Icon.png"],
            ["Acorn barnacle","Acorn_Barnacle_NL_Icon.png"],
            ["Oyster","Oyster_NL_Icon.png"],
            ["Turban shell","Turban_Shell_NL_Icon.png"],
            ["Abalone","Abalone_NL_Icon.png"],
            ["Ear shell","Ear_Shell_NL_Icon.png"],
            ["Clam","Clam_NL_Icon.png"],
            ["Pearl oyster","Pearl_Oyster_NL_Icon.png"],
            ["Scallop","Scallop_NL_Icon.png"],
            ["Sea anemone","Sea_Anemone_NL_Icon.png"],
            ["Sea star","Sea_Star_NL_Icon.png"],
            ["Sea cucumber","Sea_Cucumber_NL_Icon.png"],
            ["Sea slug","Sea_Slug_NL_Icon.png"],
            ["Flatworm","Flatworm_NL_Icon.png"],
            ["Mantis shrimp","Mantis_Shrimp_NL_Icon.png"],
            ["Sweet shrimp","Sweet_Shrimp_NL_Icon.png"],
            ["Tiger prawn","Tiger_Prawn_NL_Icon.png"],
            ["Spiny lobster","Spiny_Lobster_NL_Icon.png"],
            ["Lobster","Lobster_NL_Icon.png"],
            ["Snow crab","Snow_Crab_NL_Icon.png"],
            ["Horsehair crab","Horsehair_Crab_NL_Icon.png"],
            ["Red king crab","Red_King_Crab_NL_Icon.png"],
            ["Spider crab","Spider_Crab_NL_Icon.png"],
            ["Octopus","Octopus_NL_Icon.png"],
            ["Spotted garden eel","Spotted_Garden_Eel_NL_Icon.png"],
            ["Chambered nautilus","Chambered_Nautilus_NL_Icon.png"],
            ["Horseshoe crab","Horseshoe_Crab_NL_Icon.png"],
            ["Giant isopod","Giant_Isopod_NL_Icon.png"],
        ],
    },

    // ── New Horizons ──────────────────────────────────────────────────────────
    nh: {
        bugs: [
            ["Common butterfly","Common_Butterfly_NH_icon.png"],
            ["Yellow butterfly","Yellow_Butterfly_NH_icon.png"],
            ["Tiger butterfly","Tiger_Butterfly_NH_icon.png"],
            ["Peacock butterfly","Peacock_Butterfly_NH_icon.png"],
            ["Common bluebottle","Common_Bluebottle_NH_icon.png"],
            ["Paper kite butterfly","Paper_Kite_Butterfly_NH_icon.png"],
            ["Great purple emperor","Great_Purple_Emperor_NH_icon.png"],
            ["Monarch butterfly","Monarch_Butterfly_NH_icon.png"],
            ["Emperor butterfly","Emperor_Butterfly_NH_icon.png"],
            ["Agrias butterfly","Agrias_Butterfly_NH_icon.png"],
            ["Rajah Brooke's birdwing","Rajah_Brooke_NH_icon.png"],
            ["Queen Alexandra's birdwing","Queen_Alexandra_Birdwing_NH_icon.png"],
            ["Moth","Moth_NH_icon.png"],
            ["Atlas moth","Atlas_Moth_NH_icon.png"],
            ["Madagascan sunset moth","Madagascan_Sunset_Moth_NH_icon.png"],
            ["Long locust","Long_Locust_NH_icon.png"],
            ["Migratory locust","Migratory_Locust_NH_icon.png"],
            ["Rice grasshopper","Rice_Grasshopper_NH_icon.png"],
            ["Grasshopper","Grasshopper_NH_icon.png"],
            ["Cricket","Cricket_NH_icon.png"],
            ["Bell cricket","Bell_Cricket_NH_icon.png"],
            ["Mantis","Mantis_NH_icon.png"],
            ["Orchid mantis","Orchid_Mantis_NH_icon.png"],
            ["Honeybee","Honeybee_NH_icon.png"],
            ["Wasp","Wasp_NH_icon.png"],
            ["Brown cicada","Brown_Cicada_NH_icon.png"],
            ["Robust cicada","Robust_Cicada_NH_icon.png"],
            ["Giant cicada","Giant_Cicada_NH_icon.png"],
            ["Walker cicada","Walker_Cicada_NH_icon.png"],
            ["Evening cicada","Evening_Cicada_NH_icon.png"],
            ["Cicada shell","Cicada_Shell_NH_icon.png"],
            ["Red dragonfly","Red_Dragonfly_NH_icon.png"],
            ["Darner dragonfly","Darner_Dragonfly_NH_icon.png"],
            ["Banded dragonfly","Banded_Dragonfly_NH_icon.png"],
            ["Damselfly","Damselfly_NH_icon.png"],
            ["Firefly","Firefly_NH_icon.png"],
            ["Mole cricket","Mole_Cricket_NH_icon.png"],
            ["Pondskater","Pondskater_NH_icon.png"],
            ["Diving beetle","Diving_Beetle_NH_icon.png"],
            ["Giant water bug","Giant_Water_Bug_NH_icon.png"],
            ["Stinkbug","Stinkbug_NH_icon.png"],
            ["Man-faced stink bug","Man_Faced_Stink_Bug_NH_icon.png"],
            ["Ladybug","Ladybug_NH_icon.png"],
            ["Tiger beetle","Tiger_Beetle_NH_icon.png"],
            ["Jewel beetle","Jewel_Beetle_NH_icon.png"],
            ["Violin beetle","Violin_Beetle_NH_icon.png"],
            ["Citrus long-horned beetle","Citrus_Long_Horned_Beetle_NH_icon.png"],
            ["Rosalia batesi beetle","Rosalia_Batesi_Beetle_NH_icon.png"],
            ["Blue weevil beetle","Blue_Weevil_Beetle_NH_icon.png"],
            ["Dung beetle","Dung_Beetle_NH_icon.png"],
            ["Earth-boring dung beetle","Earth_Boring_Dung_Beetle_NH_icon.png"],
            ["Scarab beetle","Scarab_Beetle_NH_icon.png"],
            ["Drone beetle","Drone_Beetle_NH_icon.png"],
            ["Goliath beetle","Goliath_Beetle_NH_icon.png"],
            ["Saw stag","Saw_Stag_NH_icon.png"],
            ["Miyama stag","Miyama_Stag_NH_icon.png"],
            ["Giant stag","Giant_Stag_NH_icon.png"],
            ["Rainbow stag","Rainbow_Stag_NH_icon.png"],
            ["Cyclommatus stag","Cyclommatus_Stag_NH_icon.png"],
            ["Golden stag","Golden_Stag_NH_icon.png"],
            ["Giraffe stag","Giraffe_Stag_NH_icon.png"],
            ["Horned dynastid","Horned_Dynastid_NH_icon.png"],
            ["Horned atlas","Horned_Atlas_NH_icon.png"],
            ["Horned elephant","Horned_Elephant_NH_icon.png"],
            ["Horned hercules","Horned_Hercules_NH_icon.png"],
            ["Walking stick","Walking_Stick_NH_icon.png"],
            ["Walking leaf","Walking_Leaf_NH_icon.png"],
            ["Bagworm","Bagworm_NH_icon.png"],
            ["Ant","Ant_NH_icon.png"],
            ["Hermit crab","Hermit_Crab_NH_icon.png"],
            ["Wharf roach","Wharf_Roach_NH_icon.png"],
            ["Fly","Fly_NH_icon.png"],
            ["Mosquito","Mosquito_NH_icon.png"],
            ["Flea","Flea_NH_icon.png"],
            ["Snail","Snail_NH_icon.png"],
            ["Pill bug","Pill_Bug_NH_icon.png"],
            ["Centipede","Centipede_NH_icon.png"],
            ["Spider","Spider_NH_icon.png"],
            ["Tarantula","Tarantula_NH_icon.png"],
            ["Scorpion","Scorpion_NH_icon.png"],
        ],
        fish: [
            ["Bitterling","Bitterling_NH_icon.png"],
            ["Pale chub","Pale_Chub_NH_icon.png"],
            ["Crucian carp","Crucian_Carp_NH_icon.png"],
            ["Dace","Dace_NH_icon.png"],
            ["Carp","Carp_NH_icon.png"],
            ["Koi","Koi_NH_icon.png"],
            ["Goldfish","Goldfish_NH_icon.png"],
            ["Pop-eyed goldfish","Pop-Eyed_Goldfish_NH_icon.png"],
            ["Ranchu goldfish","Ranchu_Goldfish_NH_icon.png"],
            ["Killifish","Killifish_NH_icon.png"],
            ["Crawfish","Crawfish_NH_icon.png"],
            ["Soft-shelled turtle","Soft-Shelled_Turtle_NH_icon.png"],
            ["Snapping turtle","Snapping_Turtle_NH_icon.png"],
            ["Tadpole","Tadpole_NH_icon.png"],
            ["Frog","Frog_NH_icon.png"],
            ["Freshwater goby","Freshwater_Goby_NH_icon.png"],
            ["Loach","Loach_NH_icon.png"],
            ["Catfish","Catfish_NH_icon.png"],
            ["Giant snakehead","Giant_Snakehead_NH_icon.png"],
            ["Bluegill","Bluegill_NH_icon.png"],
            ["Yellow perch","Yellow_Perch_NH_icon.png"],
            ["Black bass","Black_Bass_NH_icon.png"],
            ["Tilapia","Tilapia_NH_icon.png"],
            ["Pike","Pike_NH_icon.png"],
            ["Pond smelt","Pond_Smelt_NH_icon.png"],
            ["Sweetfish","Sweetfish_NH_icon.png"],
            ["Cherry salmon","Cherry_Salmon_NH_icon.png"],
            ["Char","Char_NH_icon.png"],
            ["Golden trout","Golden_Trout_NH_icon.png"],
            ["Stringfish","Stringfish_NH_icon.png"],
            ["Salmon","Salmon_NH_icon.png"],
            ["King salmon","King_Salmon_NH_icon.png"],
            ["Mitten crab","Mitten_Crab_NH_icon.png"],
            ["Guppy","Guppy_NH_icon.png"],
            ["Nibble fish","Nibble_Fish_NH_icon.png"],
            ["Angelfish","Angelfish_NH_icon.png"],
            ["Betta","Betta_NH_icon.png"],
            ["Neon tetra","Neon_Tetra_NH_icon.png"],
            ["Rainbowfish","Rainbowfish_NH_icon.png"],
            ["Piranha","Piranha_NH_icon.png"],
            ["Arowana","Arowana_NH_icon.png"],
            ["Dorado","Dorado_NH_icon.png"],
            ["Gar","Gar_NH_icon.png"],
            ["Arapaima","Arapaima_NH_icon.png"],
            ["Saddled bichir","Saddled_Bichir_NH_icon.png"],
            ["Sturgeon","Sturgeon_NH_icon.png"],
            ["Sea butterfly","Sea_Butterfly_NH_icon.png"],
            ["Sea horse","Sea_Horse_NH_icon.png"],
            ["Clown fish","Clown_Fish_NH_icon.png"],
            ["Surgeonfish","Surgeonfish_NH_icon.png"],
            ["Butterfly fish","Butterfly_Fish_NH_icon.png"],
            ["Napoleonfish","Napoleonfish_NH_icon.png"],
            ["Zebra turkeyfish","Zebra_Turkeyfish_NH_icon.png"],
            ["Blowfish","Blowfish_NH_icon.png"],
            ["Puffer fish","Puffer_Fish_NH_icon.png"],
            ["Anchovy","Anchovy_NH_icon.png"],
            ["Horse mackerel","Horse_Mackerel_NH_icon.png"],
            ["Barred knifejaw","Barred_Knifejaw_NH_icon.png"],
            ["Sea bass","Sea_Bass_NH_icon.png"],
            ["Red snapper","Red_Snapper_NH_icon.png"],
            ["Dab","Dab_NH_icon.png"],
            ["Olive flounder","Olive_Flounder_NH_icon.png"],
            ["Squid","Squid_NH_icon.png"],
            ["Moray eel","Moray_Eel_NH_icon.png"],
            ["Ribbon eel","Ribbon_Eel_NH_icon.png"],
            ["Tuna","Tuna_NH_icon.png"],
            ["Blue marlin","Blue_Marlin_NH_icon.png"],
            ["Giant trevally","Giant_Trevally_NH_icon.png"],
            ["Mahi-mahi","Mahi-Mahi_NH_icon.png"],
            ["Ocean sunfish","Ocean_Sunfish_NH_icon.png"],
            ["Ray","Ray_NH_icon.png"],
            ["Saw shark","Saw_Shark_NH_icon.png"],
            ["Hammerhead shark","Hammerhead_Shark_NH_icon.png"],
            ["Great white shark","Great_White_Shark_NH_icon.png"],
            ["Whale shark","Whale_Shark_NH_icon.png"],
            ["Suckerfish","Suckerfish_NH_icon.png"],
            ["Football fish","Football_Fish_NH_icon.png"],
            ["Oarfish","Oarfish_NH_icon.png"],
            ["Barreleye","Barreleye_NH_icon.png"],
            ["Coelacanth","Coelacanth_NH_icon.png"],
        ],
        sea: [
            ["Seaweed","Seaweed_NH_Icon.png"],
            ["Sea grapes","Sea_Grapes_NH_Icon.png"],
            ["Sea cucumber","Sea_Cucumber_NH_Icon.png"],
            ["Sea pig","Sea_Pig_NH_Icon.png"],
            ["Sea star","Sea_Star_NH_Icon.png"],
            ["Sea urchin","Sea_Urchin_NH_Icon.png"],
            ["Slate pencil urchin","Slate_Pencil_Urchin_NH_Icon.png"],
            ["Sea anemone","Sea_Anemone_NH_Icon.png"],
            ["Moon jellyfish","Moon_Jellyfish_NH_Icon.png"],
            ["Sea slug","Sea_Slug_NH_Icon.png"],
            ["Pearl oyster","Pearl_Oyster_NH_Icon.png"],
            ["Mussel","Mussel_NH_Icon.png"],
            ["Oyster","Oyster_NH_Icon.png"],
            ["Scallop","Scallop_NH_Icon.png"],
            ["Whelk","Whelk_NH_Icon.png"],
            ["Turban shell","Turban_Shell_NH_Icon.png"],
            ["Abalone","Abalone_NH_Icon.png"],
            ["Gigas giant clam","Gigas_Giant_Clam_NH_Icon.png"],
            ["Chambered nautilus","Chambered_Nautilus_NH_Icon.png"],
            ["Octopus","Octopus_NH_Icon.png"],
            ["Umbrella octopus","Umbrella_Octopus_NH_Icon.png"],
            ["Vampire squid","Vampire_Squid_NH_Icon.png"],
            ["Firefly squid","Firefly_Squid_NH_Icon.png"],
            ["Gazami crab","Gazami_Crab_NH_Icon.png"],
            ["Dungeness crab","Dungeness_Crab_NH_Icon.png"],
            ["Snow crab","Snow_Crab_NH_Icon.png"],
            ["Red king crab","Red_King_Crab_NH_Icon.png"],
            ["Acorn barnacle","Acorn_Barnacle_NH_Icon.png"],
            ["Spider crab","Spider_Crab_NH_Icon.png"],
            ["Tiger prawn","Tiger_Prawn_NH_Icon.png"],
            ["Sweet shrimp","Sweet_Shrimp_NH_Icon.png"],
            ["Mantis shrimp","Mantis_Shrimp_NH_Icon.png"],
            ["Spiny lobster","Spiny_Lobster_NH_Icon.png"],
            ["Lobster","Lobster_NH_Icon.png"],
            ["Giant isopod","Giant_Isopod_NH_Icon.png"],
            ["Horseshoe crab","Horseshoe_Crab_NH_Icon.png"],
            ["Sea pineapple","Sea_Pineapple_NH_Icon.png"],
            ["Spotted garden eel","Spotted_Garden_Eel_NH_Icon.png"],
            ["Flatworm","Flatworm_NH_Icon.png"],
            ["Venus' flower basket","Venus'_Flower_Basket_NH_Icon.png"],
        ],
    },
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function getStorageKey(game, category) {
    if (currentRoom && currentMode === "coop" && window.currentRoomData) {
        return window.currentRoomData[`${game}_${category}`] || {};
    }
    if (currentRoom && currentMode === "race" && window.currentRoomData) {
        return window.currentRoomData?.players?.[myPseudo]?.[`${game}_${category}`] || {};
    }
    return JSON.parse(localStorage.getItem(`caught_${game}_${category}`)) || {};
}

function saveStorage(game, category, caught) {
    if (!currentRoom) {
        localStorage.setItem(`caught_${game}_${category}`, JSON.stringify(caught));
        return;
    }
    if (currentMode === "coop") {
        set(ref(`rooms/${currentRoom}/${game}_${category}`), caught);
        set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    } else {
        set(ref(`rooms/${currentRoom}/players/${myPseudo}/${game}_${category}`), caught);
        set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    }
}

// ─── ICON PATH ────────────────────────────────────────────────────────────────
function buildIconSrc(game, category, file) {
    if (file.includes("/")) {
        return `icons/${file}`;
    }
    const folder = game === "dnm" ? "gc" : game;
    return `icons/${folder}/${category}/${file}`;
}

// ─── SCOREBOARD ───────────────────────────────────────────────────────────────
const PLAYER_COLORS = 6;

function countCaught(obj) {
    return Object.values(obj || {}).filter(v => v).length;
}

function updateScoreboard(roomData) {
    if (currentMode !== "race" || !roomData?.players) {
        scoreboard.classList.remove("visible");
        scoreboard.innerHTML = "";
        return;
    }

    const game     = gameSelect.value;
    const category = categorySelect.value;
    const players  = roomData.players;

    const names = Object.keys(players).sort((a, b) => {
        if (a === myPseudo) return -1;
        if (b === myPseudo) return 1;
        const totalA = countCaught(players[a][`${game}_bugs`]) + countCaught(players[a][`${game}_fish`]) + countCaught(players[a][`${game}_sea`]);
        const totalB = countCaught(players[b][`${game}_bugs`]) + countCaught(players[b][`${game}_fish`]) + countCaught(players[b][`${game}_sea`]);
        return totalB - totalA;
    });

    scoreboard.innerHTML = "";
    scoreboard.classList.add("visible");

    names.forEach((name, index) => {
        const pData      = players[name] || {};
        const colorIndex = name === myPseudo ? 0 : ((index % (PLAYER_COLORS - 1)) + 1);

        const card   = document.createElement("div");
        card.classList.add("score-card", `player-color-${colorIndex}`);

        const nameEl = document.createElement("div");
        nameEl.classList.add("player-name");
        nameEl.textContent = name === myPseudo ? `★ ${name}` : name;

        const scoreEl = document.createElement("div");
        scoreEl.classList.add("player-score");

        if (category === "all") {
            const bugCount  = countCaught(pData[`${game}_bugs`]);
            const fishCount = countCaught(pData[`${game}_fish`]);
            const bugTotal  = DATA[game].bugs.length;
            const fishTotal = DATA[game].fish.length;
            scoreEl.innerHTML =
                `<span class="score-bugs">🐛 ${bugCount}/${bugTotal}</span><br>` +
                `<span class="score-fish">🐟 ${fishCount}/${fishTotal}</span>`;
        } else {
            const caught = countCaught(pData[`${game}_${category}`]);
            const total  = DATA[game][category]?.length || 0;
            scoreEl.textContent = `${caught} / ${total}`;
        }

        card.appendChild(nameEl);
        card.appendChild(scoreEl);
        scoreboard.appendChild(card);
    });
}

// ─── GENERIC GRID LOADER ──────────────────────────────────────────────────────
function loadGenericGrid(map, game, category, caughtClass) {
    const total = map.length;
    let caught  = getStorageKey(game, category);

    function updateCounter() {
        const count   = Object.values(caught).filter(v => v).length;
        const percent = ((count / total) * 100).toFixed(1);
        counter.textContent = `${count} / ${total}   •   ${percent}%`;
    }

    map.forEach(([name, file]) => {
        const safeKey = sanitizeKey(file);
        const cell    = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src   = buildIconSrc(game, category, file);
        if (caught[safeKey]) cell.classList.add(caughtClass);

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime  = 0;
                popSound.playbackRate = caught[safeKey] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }
            caught[safeKey] = !caught[safeKey];
            cell.classList.toggle(caughtClass);
            saveStorage(game, category, caught);
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// ─── ALL GRID LOADER ──────────────────────────────────────────────────────────
function loadAllGrid(game) {
    const bugMap   = DATA[game].bugs;
    const fishMap  = DATA[game].fish;
    const total    = bugMap.length + fishMap.length;
    let caughtBugs = getStorageKey(game, "bugs");
    let caughtFish = getStorageKey(game, "fish");

    function updateCounter() {
        const count   = Object.values(caughtBugs).filter(v => v).length
                      + Object.values(caughtFish).filter(v => v).length;
        const percent = ((count / total) * 100).toFixed(1);
        counter.textContent = `${count} / ${total}   •   ${percent}%`;
    }

    function createCell(name, file, game, category, caughtClass, caughtObj) {
        const safeKey = sanitizeKey(file);
        const cell    = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src   = buildIconSrc(game, category, file);
        if (caughtObj[safeKey]) cell.classList.add(caughtClass);

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime  = 0;
                popSound.playbackRate = caughtObj[safeKey] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }
            caughtObj[safeKey] = !caughtObj[safeKey];
            cell.classList.toggle(caughtClass);
            saveStorage(game, category, caughtObj);
            updateCounter();
        });

        return cell;
    }

    bugMap.forEach(([name, file]) => {
        grid.appendChild(createCell(name, file, game, "bugs", "caught-bugs", caughtBugs));
    });
    fishMap.forEach(([name, file]) => {
        grid.appendChild(createCell(name, file, game, "fish", "caught-fish", caughtFish));
    });

    updateCounter();
}

// ─── LOAD GRID ────────────────────────────────────────────────────────────────
function loadGrid() {
    grid.innerHTML = "";
    const game     = gameSelect.value;
    const category = categorySelect.value;

    title.textContent = `${gameSelect.options[gameSelect.selectedIndex].text} - ${categorySelect.options[categorySelect.selectedIndex].text}`;

    // Sea Creatures only available for nl and nh
    if (category === "sea" && !DATA[game]?.sea) {
        setGridCols(COLS_SINGLE);
        counter.textContent = "0 / 0";
        grid.innerHTML = "<p>No sea creatures in this game.</p>";
        return;
    }

    if (category === "all") {
        setGridCols(COLS_ALL[game]);
        loadAllGrid(game);
    } else if (category === "sea") {
        setGridCols(game === "nl" ? 6 : COLS_SINGLE);
        loadGenericGrid(DATA[game].sea, game, "sea", "caught-fish");
    } else {
        setGridCols(COLS_SINGLE);
        const caughtClass = category === "bugs" ? "caught-bugs" : "caught-fish";
        const map = DATA[game]?.[category];
        if (map) {
            loadGenericGrid(map, game, category, caughtClass);
        } else {
            counter.textContent = "0 / 0";
            grid.innerHTML = "<p>what are you doing here mate</p>";
        }
    }

    if (currentMode === "race" && window.currentRoomData) {
        updateScoreboard(window.currentRoomData);
    }
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
gameSelect.addEventListener("change", loadGrid);
categorySelect.addEventListener("change", loadGrid);
loadGrid();

document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("Reset current run?")) return;
    const game     = gameSelect.value;
    const category = categorySelect.value;

    if (!currentRoom) {
        if (category === "all") {
            localStorage.removeItem(`caught_${game}_bugs`);
            localStorage.removeItem(`caught_${game}_fish`);
        } else {
            localStorage.removeItem(`caught_${game}_${category}`);
        }
        loadGrid();
        return;
    }

    if (currentMode === "coop") {
        if (category === "all") {
            set(ref(`rooms/${currentRoom}/${game}_bugs`), {});
            set(ref(`rooms/${currentRoom}/${game}_fish`), {});
        } else {
            set(ref(`rooms/${currentRoom}/${game}_${category}`), {});
        }
        set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    } else {
        if (category === "all") {
            set(ref(`rooms/${currentRoom}/players/${myPseudo}/${game}_bugs`), {});
            set(ref(`rooms/${currentRoom}/players/${myPseudo}/${game}_fish`), {});
        } else {
            set(ref(`rooms/${currentRoom}/players/${myPseudo}/${game}_${category}`), {});
        }
        set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    }
});

document.getElementById("toggleNames").addEventListener("click", () => {
    grid.classList.toggle("show-names");
});

document.getElementById("toggleSound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("toggleSound").textContent = soundEnabled ? "SFX ON" : "SFX OFF";
});

// ─── COOP PANEL ───────────────────────────────────────────────────────────────
document.getElementById("toggleCoop").addEventListener("click", () => {
    const btn    = document.getElementById("toggleCoop");
    const isOpen = coopMenu.classList.toggle("visible");
    btn.classList.toggle("active", isOpen);
    btn.textContent = isOpen ? "Multiplayer ▲" : "Multiplayer";
});

document.getElementById("createRoom").addEventListener("click", () => {
    currentMode = "coop";
    currentRoom = Math.random().toString(36).substring(2, 8);
    set(ref(`rooms/${currentRoom}/mode`), "coop");
    set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    document.getElementById("roomInput").value = currentRoom;
    alert("Co-op room created: " + currentRoom);
    listenToRoom();
});

document.getElementById("joinRoom").addEventListener("click", () => {
    const code = document.getElementById("roomInput").value.trim();
    if (!code) return alert("Enter a room code");
    currentMode = "coop";
    currentRoom = code;
    set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    alert("Joined co-op room: " + code);
    listenToRoom();
});

document.getElementById("createRaceRoom").addEventListener("click", () => {
    const pseudo = document.getElementById("pseudoInput").value.trim();
    if (!pseudo) return alert("Enter a nickname first");
    myPseudo    = sanitizeKey(pseudo);
    currentMode = "race";
    currentRoom = Math.random().toString(36).substring(2, 8);
    set(ref(`rooms/${currentRoom}/mode`), "race");
    set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    document.getElementById("raceRoomInput").value = currentRoom;
    alert("Race room created: " + currentRoom);
    listenToRoom();
});

document.getElementById("joinRaceRoom").addEventListener("click", () => {
    const pseudo = document.getElementById("pseudoInput").value.trim();
    const code   = document.getElementById("raceRoomInput").value.trim();
    if (!pseudo) return alert("Enter a nickname first");
    if (!code)   return alert("Enter a room code");
    myPseudo    = sanitizeKey(pseudo);
    currentMode = "race";
    currentRoom = code;
    set(ref(`rooms/${currentRoom}/lastActive`), Date.now());
    alert(`Joined race room: ${code} as ${pseudo}`);
    listenToRoom();
});

// ─── FIREBASE LISTENER ────────────────────────────────────────────────────────
function listenToRoom() {
    onValue(ref(`rooms/${currentRoom}`), (snapshot) => {
        window.currentRoomData = snapshot.val() || {};
        loadGrid();
    });
}

// ─── CLEANUP OLD ROOMS ────────────────────────────────────────────────────────
function cleanupOldRooms() {
    db.ref("rooms").once("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        const now     = Date.now();
        const MAX_AGE = 1000 * 60 * 60 * 24;
        Object.keys(data).forEach(roomId => {
            const room = data[roomId];
            if (!room.lastActive) return;
            if (now - room.lastActive > MAX_AGE) {
                console.log("🧹 Deleting inactive room:", roomId);
                db.ref("rooms/" + roomId).remove();
            }
        });
    });
}

cleanupOldRooms();

// ═══════════════════════════════════════════════════════════════
// 🎉 CELEBRATION — confettis + clignotement arc-en-ciel
// ═══════════════════════════════════════════════════════════════

(function() {

    const style = document.createElement("style");
    style.textContent = `
        .confetti-piece {
            position: fixed;
            top: -12px;
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall linear forwards;
        }
        @keyframes confettiFall {
            0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
            80%  { opacity: 1; }
            100% { transform: translateY(105vh) rotate(720deg) scale(0.6); opacity: 0; }
        }

        @keyframes rainbowFlash {
            0%   { background-color: #e74c3c; border-color: #c0392b; box-shadow: 0 0 12px rgba(231,76,60,0.9); }
            14%  { background-color: #e67e22; border-color: #d35400; box-shadow: 0 0 12px rgba(230,126,34,0.9); }
            28%  { background-color: #f1c40f; border-color: #f39c12; box-shadow: 0 0 12px rgba(241,196,15,0.9); }
            42%  { background-color: #2ecc71; border-color: #27ae60; box-shadow: 0 0 12px rgba(46,204,113,0.9); }
            57%  { background-color: #3498db; border-color: #2980b9; box-shadow: 0 0 12px rgba(52,152,219,0.9); }
            71%  { background-color: #9b59b6; border-color: #8e44ad; box-shadow: 0 0 12px rgba(155,89,182,0.9); }
            85%  { background-color: #e91e8c; border-color: #c2185b; box-shadow: 0 0 12px rgba(233,30,140,0.9); }
            100% { background-color: #e74c3c; border-color: #c0392b; box-shadow: 0 0 12px rgba(231,76,60,0.9); }
        }

        .cell.rainbow-flash {
            animation: rainbowFlash 0.6s linear infinite !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);

    const COLORS = [
        "#e74c3c","#e67e22","#f1c40f","#2ecc71",
        "#3498db","#9b59b6","#e91e8c","#1abc9c","#fff"
    ];

    const RESTORE_COLORS = {
        bugs: { bg: "#2ecc71", border: "#27ae60", shadow: "rgba(46,204,113,0.6)" },
        fish: { bg: "#3498db", border: "#2980b9", shadow: "rgba(52,152,219,0.6)" },
        none: { bg: "#2c2c2c", border: "#444",    shadow: "none" },
    };

    function launchConfetti() {
        for (let i = 0; i < 120; i++) {
            setTimeout(() => {
                const el = document.createElement("div");
                el.classList.add("confetti-piece");
                const size = 6 + Math.random() * 8;
                const dur  = 2.2 + Math.random() * 2;
                el.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    width: ${size}px; height: ${size}px;
                    background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
                    border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
                    animation-duration: ${dur}s;
                `;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), dur * 1000 + 100);
            }, i * 18);
        }
    }

    function flashCells() {
        const cells = document.querySelectorAll(".cell");
        const FLASH_DURATION = 3200;
        const FADE_DURATION  = 700;

        const savedClasses = [];
        cells.forEach(cell => {
            savedClasses.push({
                hasBugs: cell.classList.contains("caught-bugs"),
                hasFish: cell.classList.contains("caught-fish"),
            });
            cell.classList.remove("caught-bugs", "caught-fish");
        });

        cells.forEach((cell, i) => {
            setTimeout(() => cell.classList.add("rainbow-flash"), i * 15);
        });

        setTimeout(() => {
            cells.forEach((cell, i) => {
                const saved  = savedClasses[i];
                const target = saved.hasBugs ? RESTORE_COLORS.bugs
                             : saved.hasFish ? RESTORE_COLORS.fish
                             : RESTORE_COLORS.none;

                cell.classList.remove("rainbow-flash");
                cell.style.transition       = "none";
                cell.style.backgroundColor  = "#e74c3c";
                cell.style.borderColor      = "#c0392b";
                cell.style.boxShadow        = "0 0 12px rgba(231,76,60,0.9)";

                void cell.offsetWidth;

                cell.style.transition = `background-color ${FADE_DURATION}ms ease,
                                         border-color ${FADE_DURATION}ms ease,
                                         box-shadow ${FADE_DURATION}ms ease`;
                cell.style.backgroundColor = target.bg;
                cell.style.borderColor     = target.border;
                cell.style.boxShadow       = target.shadow === "none"
                    ? "none"
                    : `0 0 10px ${target.shadow}`;

                setTimeout(() => {
                    cell.style.transition      = "";
                    cell.style.backgroundColor = "";
                    cell.style.borderColor     = "";
                    cell.style.boxShadow       = "";
                    if (saved.hasBugs) cell.classList.add("caught-bugs");
                    if (saved.hasFish) cell.classList.add("caught-fish");
                }, FADE_DURATION + 20);
            });
        }, FLASH_DURATION);
    }

    function celebrate() {
        launchConfetti();
        flashCells();
    }

    // ── Surveille le compteur ─────────────────────────────────
    // lastWas100 est remis à false à chaque loadGrid() (rechargement Firebase)
    // pour que tous les joueurs en co-op voient la célébration.
    let lastWas100 = false;
    const counterEl = document.getElementById("counter");

    // Patch loadGrid pour réinitialiser lastWas100 à chaque rechargement
    const _origLoadGrid = window.loadGrid;
    window.loadGrid = function() {
        lastWas100 = false;
        _origLoadGrid.apply(this, arguments);
    };

    new MutationObserver(() => {
        const match = counterEl.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        if (!match) return;
        const is100 = parseInt(match[1]) === parseInt(match[2]) && parseInt(match[2]) > 0;
        if (is100 && !lastWas100) celebrate();
        lastWas100 = is100;
    }).observe(counterEl, { childList: true, characterData: true, subtree: true });

})();
