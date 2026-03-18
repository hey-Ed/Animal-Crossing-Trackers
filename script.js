let soundEnabled = true;
const grid = document.getElementById("grid");
const popSound = new Audio("sounds/pop.mp3");
popSound.volume = 0.3; // volume réduit
const counter = document.getElementById("counter");

const gameSelect = document.getElementById("gameSelect");
const categorySelect = document.getElementById("categorySelect");
const title = document.getElementById("title");

// clé dynamique par jeu + catégorie
function getStorageKey() {
    const game = gameSelect.value;
    const category = categorySelect.value;
    return `caught_${game}_${category}`;
}

// mapping (game order)
const bugMap = [
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
["Scorpion","Scorpion_CF_Icon.png"]
];
const fishMap = [
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
["Coelacanth","Coelacanth_CF_Icon.png"]
];
const wwBugMap = [
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
["Scorpion","Scorpion_WW_Inv_Icon.png"]
];
const wwFishMap = [
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
["Coelacanth","Coelacanth_WW_Inv_Icon.png"]
];
const gcFishMap = [
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
["Arapaima","Arapaima_PG_Icon_Upscaled.png"]
];
const gcBugMap = [
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
["Bagworm","Bagworm_PG_Icon_Upscaled.png"]
];
const nlBugMap = [
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
["Scorpion","Scorpion_NL_Icon.png"]
];
const nlFishMap = [
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
["Coelacanth","Coelacanth_NL_Icon.png"]
];
const nhBugMap = [
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
["Scorpion","Scorpion_NH_icon.png"]
];
const nhFishMap = [
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
["Coelacanth","Coelacanth_NH_icon.png"]
];

// load grid
function loadGrid() {
    grid.innerHTML = "";

    const game = gameSelect.value;
    const category = categorySelect.value;

    title.textContent = `${gameSelect.options[gameSelect.selectedIndex].text} - ${categorySelect.options[categorySelect.selectedIndex].text}`;

if (game === "cf" && category === "bugs") {
    loadCityFolkBugs();
} else if (game === "cf" && category === "fish") {
    loadCityFolkFish();
} else if (game === "ww" && category === "bugs") {
    loadWildWorldBugs();
} else if (game === "ww" && category === "fish") {
    loadWildWorldFish();
} else if (game === "gc" && category === "fish") {
    loadGameCubeFish();
} else if (game === "gc" && category === "bugs") {
    loadGameCubeBugs();
} else if (game === "nl" && category === "bugs") {
    loadNewLeafBugs();
} else if (game === "nl" && category === "fish") {
    loadNewLeafFish();
} else if (game === "nh" && category === "bugs") {
    loadNewHorizonsBugs();
} else if (game === "nh" && category === "fish") {
    loadNewHorizonsFish();
} else {
        counter.textContent = "0 / 0";
        grid.innerHTML = "<p>Pas encore implémenté</p>";
    }
}

// 🐛 City Folk bugs
function loadCityFolkBugs() {
    const total = bugMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    bugMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/cf/bugs/${file}`;

        if (caught[file]) cell.classList.add("caught-bugs");

        cell.appendChild(img);
		const label = document.createElement("div");
label.classList.add("name");
label.textContent = name;
cell.appendChild(label);

        cell.addEventListener("click", () => {
    if (soundEnabled) {
    popSound.currentTime = 0;
    popSound.playbackRate = caught[file] ? 0.8 : 1;
    popSound.play().catch(() => {});
}
            caught[file] = !caught[file];
            cell.classList.toggle("caught-bugs");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐟 City Folk fish
function loadCityFolkFish() {
    const total = fishMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    fishMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/cf/fish/${file}`;

        if (caught[file]) cell.classList.add("caught-fish");

        cell.appendChild(img);
		const label = document.createElement("div");
label.classList.add("name");
label.textContent = name;
cell.appendChild(label);

        cell.addEventListener("click", () => {
    if (soundEnabled) {
    popSound.currentTime = 0;
    popSound.playbackRate = caught[file] ? 0.8 : 1;
    popSound.play().catch(() => {});
}
            caught[file] = !caught[file];
            cell.classList.toggle("caught-fish");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐛 Wild World bugs
function loadWildWorldBugs() {
    const total = wwBugMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    wwBugMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/ww/bugs/${file}`;

        if (caught[file]) cell.classList.add("caught-bugs");

        cell.appendChild(img);
		const label = document.createElement("div");
label.classList.add("name");
label.textContent = name;
cell.appendChild(label);

        cell.addEventListener("click", () => {
    if (soundEnabled) {
    popSound.currentTime = 0;
    popSound.playbackRate = caught[file] ? 0.8 : 1;
    popSound.play().catch(() => {});
}
            caught[file] = !caught[file];
            cell.classList.toggle("caught-bugs");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐟 Wild World fish
function loadWildWorldFish() {
    const total = wwFishMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    wwFishMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/ww/fish/${file}`;

        if (caught[file]) cell.classList.add("caught-fish");

        cell.appendChild(img);
		const label = document.createElement("div");
label.classList.add("name");
label.textContent = name;
cell.appendChild(label);

        cell.addEventListener("click", () => {
    if (soundEnabled) {
    popSound.currentTime = 0;
    popSound.playbackRate = caught[file] ? 0.8 : 1;
    popSound.play().catch(() => {});
}
            caught[file] = !caught[file];
            cell.classList.toggle("caught-fish");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐛 GameCube bugs
function loadGameCubeBugs() {
    const total = gcBugMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    gcBugMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/gc/bugs/${file}`;

        if (caught[file]) cell.classList.add("caught-bugs");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-bugs");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐟 GameCube fish
function loadGameCubeFish() {
    const total = gcFishMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    gcFishMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/gc/fish/${file}`;

        if (caught[file]) cell.classList.add("caught-fish");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-fish");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐛 New Leaf bugs
function loadNewLeafBugs() {
    const total = nlBugMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

    function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = count + " / " + total + "   •   " + percent + "%";
}

    nlBugMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/nl/bugs/${file}`;

        if (caught[file]) cell.classList.add("caught-bugs");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-bugs");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐟 New Leaf fish
function loadNewLeafFish() {
    const total = nlFishMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

    function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = `${count} / ${total}   •   ${percent}%`;
}

    nlFishMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/nl/fish/${file}`;

        if (caught[file]) cell.classList.add("caught-fish");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-fish");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐛 New Horizons bugs
function loadNewHorizonsBugs() {
    const total = nhBugMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

    function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = `${count} / ${total}   •   ${percent}%`;
}

    nhBugMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/nh/bugs/${file}`;

        if (caught[file]) cell.classList.add("caught-bugs");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-bugs");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// 🐟 New Horizons fish
function loadNewHorizonsFish() {
    const total = nhFishMap.length;
    let caught = JSON.parse(localStorage.getItem(getStorageKey())) || {};

    function updateCounter() {
    const count = Object.values(caught).filter(v => v).length;
    const percent = ((count / total) * 100).toFixed(1);
    counter.textContent = `${count} / ${total}   •   ${percent}%`;
}

    nhFishMap.forEach(([name, file]) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const img = document.createElement("img");
        img.src = `icons/nh/fish/${file}`;

        if (caught[file]) cell.classList.add("caught-fish");

        cell.appendChild(img);

        const label = document.createElement("div");
        label.classList.add("name");
        label.textContent = name;
        cell.appendChild(label);

        cell.addEventListener("click", () => {
            if (soundEnabled) {
                popSound.currentTime = 0;
                popSound.playbackRate = caught[file] ? 0.8 : 1;
                popSound.play().catch(() => {});
            }

            caught[file] = !caught[file];
            cell.classList.toggle("caught-fish");

            localStorage.setItem(getStorageKey(), JSON.stringify(caught));
            updateCounter();
        });

        grid.appendChild(cell);
    });

    updateCounter();
}

// events
gameSelect.addEventListener("change", loadGrid);
categorySelect.addEventListener("change", loadGrid);

// inital loading
loadGrid();

// reset
document.getElementById("reset").addEventListener("click", () => {
    if (confirm("Reset current run?")) {
        localStorage.removeItem(getStorageKey());
        loadGrid();
    }
});

// name toggle
document.getElementById("toggleNames").addEventListener("click", () => {
    grid.classList.toggle("show-names");
});

document.getElementById("toggleSound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    document.getElementById("toggleSound").textContent =
        soundEnabled ? "SFX ON" : "SFX OFF";
});
