export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  answer: boolean;
  explanation: string;
};

export const quizCategories = [
  "Plastic Identification",
  "Recycling & Disposal",
  "Nigerian Waste System",
  "Environmental Impact",
  "Health & Safety",
  "Community Action",
  "Climate & Circular Economy",
  "EarthMender Platform",
] as const;

export const quizBank: QuizQuestion[] = [
  {
    id: 1,
    category: "Plastic Identification",
    question:
      "The resin code on the bottom of a plastic bottle tells you what type of plastic it is made from.",
    answer: true,
    explanation:
      "Resin codes 1–7 identify the plastic type. #1 PET (drink bottles) and #2 HDPE are the most commonly recycled types in Nigeria.",
  },
  {
    id: 2,
    category: "Plastic Identification",
    question:
      "Eva Water, Pepsi, and La Casera bottles are all made from the same type of plastic — PET (#1).",
    answer: true,
    explanation:
      "All clear, crushable drink bottles are PET (#1). They are the most widely accepted plastic at Nigerian recycling points.",
  },
  {
    id: 3,
    category: "Plastic Identification",
    question:
      "A Milo sachet and a pure water sachet are different types of plastic and must be sorted separately before recycling.",
    answer: false,
    explanation:
      "Both are flexible plastic film (polythene). Recyclers treat them identically — collect dry and clean, take to Wecyclers or RecyclePoints.",
  },
  {
    id: 4,
    category: "Plastic Identification",
    question:
      "Styrofoam (polystyrene) cups and takeaway packs carry the resin code #6.",
    answer: true,
    explanation:
      "#6 PS (polystyrene) is one of the hardest plastics to recycle. No facility currently accepts it at scale in Nigeria.",
  },
  {
    id: 5,
    category: "Plastic Identification",
    question:
      "Black polythene bags are harder to recycle than transparent or coloured bags because optical sorting machines cannot read them.",
    answer: true,
    explanation:
      "Black carbon pigment absorbs infrared light used by automated sorting machines, making black bags nearly invisible to the equipment.",
  },
  {
    id: 6,
    category: "Plastic Identification",
    question:
      "Plastic bottles float on water, which is why they end up in rivers and coastal areas so easily.",
    answer: true,
    explanation:
      "PET plastic has a density lower than water, so it floats. This is why plastic bottles travel far through drainage systems into rivers, lagoons, and the ocean.",
  },
  {
    id: 7,
    category: "Plastic Identification",
    question:
      "All white or clear plastic bags are safe to burn because they contain no harmful chemicals.",
    answer: false,
    explanation:
      "All plastic bags release toxic gases when burned regardless of colour, including dioxins, furans, and hydrogen chloride. Burning plastic is never safe.",
  },
  {
    id: 8,
    category: "Plastic Identification",
    question:
      "A jerry can used to store petrol is typically made from #2 HDPE plastic.",
    answer: true,
    explanation:
      "HDPE (#2) is used for fuel containers, industrial drums, and large storage cans because of its chemical resistance and durability.",
  },
  {
    id: 9,
    category: "Plastic Identification",
    question:
      "Plastic straws and plastic spoons belong to the same waste category as cups and takeaway packs — disposables.",
    answer: true,
    explanation:
      "All single-use plastic items — straws, spoons, forks, cups, and takeaway packs — fall under the disposables category. Rinse and take to your PSP collector.",
  },
  {
    id: 10,
    category: "Plastic Identification",
    question:
      "Microplastics are pieces of plastic larger than 5 centimetres that break off from bigger plastic items.",
    answer: false,
    explanation:
      "Microplastics are pieces SMALLER than 5 millimetres, not centimetres. They form when larger plastics degrade and are now found in drinking water, fish, and even human blood.",
  },
  {
    id: 11,
    category: "Plastic Identification",
    question:
      "The cap of a PET plastic bottle is usually made from a different type of plastic than the bottle itself.",
    answer: true,
    explanation:
      "Bottle caps are usually made from #5 PP (polypropylene) while the bottle body is #1 PET. Remove and recycle caps separately.",
  },
  {
    id: 12,
    category: "Plastic Identification",
    question:
      "Sachets used for pure water in Nigeria are considered one of the most common forms of plastic pollution in the country.",
    answer: true,
    explanation:
      "Nigeria consumes an estimated 60 million pure water sachets every day. Most are discarded carelessly and end up blocking drains and waterways.",
  },
  {
    id: 13,
    category: "Plastic Identification",
    question:
      "A plastic dustbin and a plastic jerry can belong to the same EarthMender waste class: waste_container.",
    answer: true,
    explanation:
      "EarthMender's waste_container class covers large rigid plastic containers including dustbins, drums, buckets, and jerry cans.",
  },
  {
    id: 14,
    category: "Plastic Identification",
    question:
      "Crisp packets and juice box packaging can be recycled at most Nigerian recycling points.",
    answer: false,
    explanation:
      "Multi-layer packaging (foil-lined crisp bags, Tetra Pak juice boxes) cannot be recycled at most Nigerian facilities. They require specialised industrial equipment.",
  },
  {
    id: 15,
    category: "Plastic Identification",
    question:
      "All plastics that look similar can be recycled together without checking the resin code.",
    answer: false,
    explanation:
      "Different plastics have different melting points and chemical compositions. Mixing types contaminates entire recycling batches. Always check the resin code.",
  },
  {
    id: 16,
    category: "Recycling & Disposal",
    question:
      "Rinsing a plastic bottle before recycling improves the quality of the recycled material and prevents rejection.",
    answer: true,
    explanation:
      "Food and liquid residue contaminates entire batches of recycled plastic. A quick rinse takes 10 seconds and dramatically improves recycling yield.",
  },
  {
    id: 17,
    category: "Recycling & Disposal",
    question:
      "Crushing plastic bottles flat before storing them saves space and makes them easier to transport to a recycler.",
    answer: true,
    explanation:
      "A crushed bottle takes up about 10% of the space of an uncrushed one. This means you can collect more before making a trip, and transport costs are lower for recyclers.",
  },
  {
    id: 18,
    category: "Recycling & Disposal",
    question:
      "RecyclePoints kiosks in Lagos pay cash or airtime for plastic bottles and water sachets by weight.",
    answer: true,
    explanation:
      "RecyclePoints operates kiosks at many Lagos filling stations and markets, paying per kilogram of clean, dry plastic brought in.",
  },
  {
    id: 19,
    category: "Recycling & Disposal",
    question:
      "You need at least 100 pure water sachets before a recycler will accept them.",
    answer: false,
    explanation:
      "There is no minimum quantity rule at most Nigerian recycling points. However, practically, collecting 20+ sachets before going is worthwhile since payment is per kilogram.",
  },
  {
    id: 20,
    category: "Recycling & Disposal",
    question:
      "Wecyclers offers free kerbside plastic waste collection in Lagos — you do not need to bring waste to a kiosk.",
    answer: true,
    explanation:
      "Wecyclers operates a kerbside pickup service in many Lagos neighbourhoods. Register for free and they collect from your home on scheduled days.",
  },
  {
    id: 21,
    category: "Recycling & Disposal",
    question:
      "Food-contaminated plastic waste is easier to recycle than clean plastic waste.",
    answer: false,
    explanation:
      "Food contamination is the primary reason plastic waste is rejected at recycling facilities. Contaminated batches must either be cleaned industrially (expensive) or sent to landfill.",
  },
  {
    id: 22,
    category: "Recycling & Disposal",
    question:
      "Recycling plastic uses significantly less energy than producing new plastic from raw materials.",
    answer: true,
    explanation:
      "Recycling PET plastic uses approximately 70% less energy than producing virgin PET from petroleum. It also reduces CO₂ emissions by up to 60%.",
  },
  {
    id: 23,
    category: "Recycling & Disposal",
    question:
      "Burying plastic waste in the ground is an acceptable long-term disposal method.",
    answer: false,
    explanation:
      "Buried plastic takes 400–500 years to break down and leaches toxic chemicals into soil and groundwater throughout that time. It is not an acceptable disposal method.",
  },
  {
    id: 24,
    category: "Recycling & Disposal",
    question:
      "Wet polythene bags are rejected at most Nigerian recycling collection points.",
    answer: true,
    explanation:
      "Moisture causes mould, reduces weight accuracy, and affects the quality of recycled output. Always store nylons clean and dry before bringing to a recycler.",
  },
  {
    id: 25,
    category: "Recycling & Disposal",
    question:
      "Setting up a collection bag at your home, office, or school specifically for plastic waste is an effective way to build a recycling habit.",
    answer: true,
    explanation:
      "Behavioural research shows that designated collection containers dramatically increase recycling rates. A dedicated bag removes the decision friction each time.",
  },
  {
    id: 26,
    category: "Recycling & Disposal",
    question:
      "Used engine oil containers (jerry cans) should be disposed of in regular household waste bins.",
    answer: false,
    explanation:
      "Oil-contaminated containers are hazardous waste. They must go to designated hazardous waste collectors. Local scrap dealers also buy metal jerry cans for their material value.",
  },
  {
    id: 27,
    category: "Recycling & Disposal",
    question:
      "A plastic bottle can be turned into new fibres used to make clothing and footwear.",
    answer: true,
    explanation:
      "Recycled PET (rPET) is widely used in the fashion and sportswear industry. Major brands use recycled plastic bottles in their fabric production.",
  },
  {
    id: 28,
    category: "Recycling & Disposal",
    question:
      "Composting food waste at home reduces the total amount of waste your household sends to landfill by up to 30%.",
    answer: true,
    explanation:
      "Food and organic waste makes up 30–40% of typical Nigerian household waste. Home composting diverts all of this and produces free fertiliser for your garden.",
  },
  {
    id: 29,
    category: "Recycling & Disposal",
    question:
      "You can recycle paper that has been soaked in oil or contaminated with food grease.",
    answer: false,
    explanation:
      "Oil and grease contaminate paper fibres and make them impossible to pulp correctly. Greasy paper (e.g. suya wrapping paper) must go to general waste.",
  },
  {
    id: 30,
    category: "Recycling & Disposal",
    question:
      "It is better to reuse a plastic bag multiple times before recycling it than to recycle it after one use.",
    answer: true,
    explanation:
      "The waste hierarchy prioritises: Refuse → Reduce → Reuse → Recycle → Dispose. Reusing a bag 10 times before recycling it has a much lower environmental footprint than recycling after one use.",
  },
  {
    id: 31,
    category: "Recycling & Disposal",
    question:
      "Old mobile phones, batteries, and broken bulbs should be placed in regular waste bins.",
    answer: false,
    explanation:
      "These are e-waste and contain heavy metals (lead, mercury, cadmium) that are highly toxic. Take them to Hinckley Nigeria e-waste collection or manufacturer take-back schemes.",
  },
  {
    id: 32,
    category: "Recycling & Disposal",
    question:
      "Aluminium cans can be recycled indefinitely without any loss of material quality.",
    answer: true,
    explanation:
      "Aluminium is one of the few materials that can be recycled infinitely without degradation. Recycling aluminium uses 95% less energy than producing it from raw bauxite ore.",
  },
  {
    id: 33,
    category: "Recycling & Disposal",
    question:
      "Broken glass should be placed loosely in a recycling bin with other materials.",
    answer: false,
    explanation:
      "Broken glass is a safety hazard for waste workers. It should be wrapped in newspaper, clearly labelled, and placed separately. Intact glass bottles can go directly to glass recyclers.",
  },
  {
    id: 34,
    category: "Recycling & Disposal",
    question:
      "Carrying a reusable water bottle eliminates the need to purchase and dispose of plastic sachets daily.",
    answer: true,
    explanation:
      "A single reusable bottle can prevent the purchase of hundreds of plastic sachets per year. At ₦20–30 per sachet, it also saves significant money over time.",
  },
  {
    id: 35,
    category: "Recycling & Disposal",
    question:
      "Glass bottles take longer to decompose in a landfill than plastic bottles.",
    answer: true,
    explanation:
      "Glass can take up to 1 million years to decompose naturally. However, unlike plastic, it does not leach toxic chemicals as it breaks down and is 100% recyclable.",
  },
  {
    id: 36,
    category: "Nigerian Waste System",
    question: "LAWMA stands for Lagos Waste Management Authority.",
    answer: true,
    explanation:
      "LAWMA (Lagos Waste Management Authority) is responsible for waste management in Lagos State, including bin placement, PSP operator licensing, and enforcement.",
  },
  {
    id: 37,
    category: "Nigerian Waste System",
    question:
      "PSP stands for Private Sector Participation — the model where licensed private operators collect waste in Nigerian cities.",
    answer: true,
    explanation:
      "PSP operators are licensed by state waste authorities (LAWMA, AEPB) to provide waste collection services. Households pay them directly for regular collection.",
  },
  {
    id: 38,
    category: "Nigerian Waste System",
    question:
      "Nigeria has a functioning national deposit-return scheme where you receive money back for returning plastic bottles to shops.",
    answer: false,
    explanation:
      "Nigeria does not yet have a formal national deposit-return scheme like those in Germany or Norway. RecyclePoints and Wecyclers are private sector approximations, but they are not yet national policy.",
  },
  {
    id: 39,
    category: "Nigerian Waste System",
    question:
      "The Extended Producer Responsibility (EPR) policy in Nigeria makes manufacturers partially responsible for the waste their products generate.",
    answer: true,
    explanation:
      "Nigeria's National Plastic Action Partnership (NPAP) and recent EPR frameworks require manufacturers of plastic packaging to contribute to collection and recycling infrastructure.",
  },
  {
    id: 40,
    category: "Nigerian Waste System",
    question: "AEPB is the waste management authority for Abuja (FCT).",
    answer: true,
    explanation:
      "AEPB (Abuja Environmental Protection Board) manages waste and environmental sanitation in the Federal Capital Territory.",
  },
  {
    id: 41,
    category: "Nigerian Waste System",
    question:
      "Burning waste in open dumps is illegal under Nigerian environmental law.",
    answer: true,
    explanation:
      "The National Environmental Standards and Regulations Enforcement Agency Act (NESREA) prohibits open burning of waste. However, enforcement remains weak in practice.",
  },
  {
    id: 42,
    category: "Nigerian Waste System",
    question: "Nigeria currently recycles more than 50% of its plastic waste.",
    answer: false,
    explanation:
      "Nigeria recycles an estimated 5–12% of its plastic waste — far below global leaders. Improving collection infrastructure and awareness is critical to closing this gap.",
  },
  {
    id: 43,
    category: "Nigerian Waste System",
    question:
      "Informal waste pickers (Ọlọbẹ scrap dealers) play an important role in Nigeria's recycling system.",
    answer: true,
    explanation:
      "Informal waste collectors retrieve an estimated 60–80% of all recycled materials in Nigeria. Supporting and formalising this sector is key to improving recycling rates.",
  },
  {
    id: 44,
    category: "Nigerian Waste System",
    question:
      "Most Nigerian cities have enough formal waste collection bins to handle the volume of waste generated daily.",
    answer: false,
    explanation:
      "Nigerian cities face a significant infrastructure deficit. Many communities have no formal collection bins, which is a primary driver of littering and illegal dumping.",
  },
  {
    id: 45,
    category: "Nigerian Waste System",
    question:
      "The single-use plastics ban in Lagos covers plastic bags below a certain thickness.",
    answer: true,
    explanation:
      "Lagos State banned plastic bags below 0.05mm thickness in 2024 as part of a broader push to reduce plastic pollution, though enforcement is still developing.",
  },
  {
    id: 46,
    category: "Nigerian Waste System",
    question:
      "In Nigeria, the waste sector employs millions of people directly and indirectly across the informal economy.",
    answer: true,
    explanation:
      "From PSP truck drivers to market traders and scrap dealers, waste management is a significant source of informal employment in Nigerian cities.",
  },
  {
    id: 47,
    category: "Nigerian Waste System",
    question:
      "Sanitation levies collected from businesses in Lagos go directly to LAWMA for waste infrastructure.",
    answer: true,
    explanation:
      "LAWMA collects sanitation fees from commercial premises, which are meant to fund improved waste collection, bins, and processing infrastructure.",
  },
  {
    id: 48,
    category: "Nigerian Waste System",
    question:
      "Nigeria's coastal and fishing communities are disproportionately affected by plastic waste compared to inland communities.",
    answer: true,
    explanation:
      "Plastic from inland cities travels through rivers to coastal areas. Fishing communities in the Niger Delta and Lagos coastline report significant economic losses from plastic-entangled fishing nets and contaminated fish.",
  },
  {
    id: 49,
    category: "Nigerian Waste System",
    question:
      "Every Nigerian state has its own waste management authority equivalent to LAWMA.",
    answer: false,
    explanation:
      "Many Nigerian states have underfunded or non-functional waste management bodies. Lagos and Abuja are the most developed. Many states rely on weak local government structures.",
  },
  {
    id: 50,
    category: "Nigerian Waste System",
    question:
      "A PSP operator's primary obligation is to ensure that households they service have their waste collected on a regular, scheduled basis.",
    answer: true,
    explanation:
      "PSP operators are licensed under a service contract that includes collection frequency requirements. Households can report non-compliance to LAWMA or AEPB.",
  },
  {
    id: 51,
    category: "Environmental Impact",
    question:
      "A PET plastic bottle takes between 400 and 500 years to decompose in a landfill.",
    answer: true,
    explanation:
      "PET plastic's chemical structure is highly resistant to biological degradation. In a typical landfill, it will still exist in fragmented form hundreds of years from now.",
  },
  {
    id: 52,
    category: "Environmental Impact",
    question:
      "Polythene bags stuck in drains are a leading cause of urban flooding in Nigerian cities during rainy season.",
    answer: true,
    explanation:
      "Blocked drainage from plastic bags and water sachets is the primary cause of flooding events in Lagos, Port Harcourt, and Kano. Each flood causes billions of naira in damage.",
  },
  {
    id: 53,
    category: "Environmental Impact",
    question:
      "Plastic pollution in the ocean breaks down harmlessly within a few years due to saltwater.",
    answer: false,
    explanation:
      "Saltwater and UV light break plastic into smaller and smaller pieces called microplastics, but the plastic never fully disappears. Microplastics persist in the ocean for centuries.",
  },
  {
    id: 54,
    category: "Environmental Impact",
    question:
      "Microplastics have been found in bottled drinking water, sea fish, and human blood.",
    answer: true,
    explanation:
      "Multiple peer-reviewed studies have confirmed the presence of microplastic particles in all three. The long-term health effects of human microplastic ingestion are still being studied.",
  },
  {
    id: 55,
    category: "Environmental Impact",
    question:
      "Burning 1 kilogram of plastic releases approximately the same amount of carbon as burning 1 kilogram of coal.",
    answer: false,
    explanation:
      "Burning plastic actually releases MORE carbon per kilogram than coal — roughly 2–3 kg of CO₂ per kg of plastic — plus additional toxic compounds not present in coal combustion.",
  },
  {
    id: 56,
    category: "Environmental Impact",
    question:
      "Animals including cows, fish, and birds regularly die from ingesting or becoming entangled in plastic waste.",
    answer: true,
    explanation:
      "Over 1 million seabirds and 100,000 marine mammals die annually from plastic entanglement and ingestion globally. In Nigeria, cattle deaths from ingesting plastic bags are regularly reported.",
  },
  {
    id: 57,
    category: "Environmental Impact",
    question:
      "Plastic pollution reduces tourism revenue in coastal communities.",
    answer: true,
    explanation:
      "Plastic-strewn beaches deter tourists, costing coastal communities millions in lost revenue. Studies in West African coastal areas show direct correlation between beach cleanliness and visitor numbers.",
  },
  {
    id: 58,
    category: "Environmental Impact",
    question:
      "Plastic in soil reduces its fertility and damages agricultural productivity.",
    answer: true,
    explanation:
      "Microplastics disrupt soil microorganism ecosystems, reduce water retention, and can be absorbed by plant roots. This threatens food security, particularly for smallholder farmers.",
  },
  {
    id: 59,
    category: "Environmental Impact",
    question:
      "The 'Great Pacific Garbage Patch' is a solid island of plastic you could walk across.",
    answer: false,
    explanation:
      "The Great Pacific Garbage Patch is primarily a diffuse soup of microplastics, not a solid mass. Most particles are not visible to the naked eye, making cleanup extremely difficult.",
  },
  {
    id: 60,
    category: "Environmental Impact",
    question:
      "Chemicals added to plastics during manufacturing — such as BPA — can leach into food and water stored in plastic containers.",
    answer: true,
    explanation:
      "Chemicals like BPA (bisphenol A) and phthalates are known endocrine disruptors. They leach more readily when plastic is heated — which is why microwaving food in plastic is discouraged.",
  },
  {
    id: 61,
    category: "Environmental Impact",
    question:
      "Illegal dumping of plastic waste in rivers is a significant contributor to Africa's contribution to ocean plastic pollution.",
    answer: true,
    explanation:
      "African rivers, particularly those draining into the Atlantic and Indian Oceans, carry substantial plastic loads. River-borne plastic is responsible for the majority of ocean plastic globally.",
  },
  {
    id: 62,
    category: "Environmental Impact",
    question:
      "Replacing single-use plastic bags with paper bags always has a lower environmental impact.",
    answer: false,
    explanation:
      "Production of a paper bag requires more water and energy than a plastic bag. A paper bag must be reused at least 3–4 times to break even on environmental impact. Context matters.",
  },
  {
    id: 63,
    category: "Environmental Impact",
    question:
      "Children living near open waste dumps have higher rates of respiratory disease.",
    answer: true,
    explanation:
      "Studies in Lagos, Port Harcourt, and other Nigerian cities confirm elevated respiratory illness rates in communities adjacent to open dumps, due to particulates from burning and decomposing waste.",
  },
  {
    id: 64,
    category: "Environmental Impact",
    question:
      "A single improperly disposed chemical drum can contaminate thousands of litres of groundwater.",
    answer: true,
    explanation:
      "Industrial chemicals in drums leach through soil into aquifers. Even small quantities of some chemicals can render large volumes of water unsafe for human consumption.",
  },
  {
    id: 65,
    category: "Environmental Impact",
    question:
      "Reducing plastic production is more effective than increasing plastic recycling for addressing the plastic pollution crisis.",
    answer: true,
    explanation:
      "The Ellen MacArthur Foundation estimates only 9% of plastic ever produced has been recycled. Systemic reduction at source — fewer plastics produced — is more impactful than end-of-pipe recycling.",
  },
  {
    id: 66,
    category: "Environmental Impact",
    question:
      "Marine plastic pollution primarily comes from ships dumping waste at sea.",
    answer: false,
    explanation:
      "Approximately 80% of ocean plastic comes from land-based sources carried by rivers and wind. Only about 20% comes from maritime sources such as fishing vessels and cargo ships.",
  },
  {
    id: 67,
    category: "Environmental Impact",
    question:
      "Flooding caused by blocked plastic-filled drains can spread waterborne diseases like cholera and typhoid.",
    answer: true,
    explanation:
      "Floodwater mixes with sewage and creates ideal conditions for cholera, typhoid, and leptospirosis. Post-flood disease outbreaks in Nigerian cities are regularly linked to plastic-blocked drainage.",
  },
  {
    id: 68,
    category: "Environmental Impact",
    question:
      "Lake Chad has shrunk significantly in recent decades, partly due to pollution including plastic waste.",
    answer: true,
    explanation:
      "While climate change and agricultural irrigation are the primary drivers of Lake Chad's 90% reduction since the 1960s, plastic pollution has contributed to the degradation of the remaining water ecosystem.",
  },
  {
    id: 69,
    category: "Environmental Impact",
    question:
      "If plastic pollution continues at its current rate, there will be more plastic than fish (by weight) in the ocean by 2050.",
    answer: true,
    explanation:
      "This projection comes from a widely cited Ellen MacArthur Foundation report. At current production and disposal rates, ocean plastic mass will exceed fish biomass within decades.",
  },
  {
    id: 70,
    category: "Environmental Impact",
    question:
      "Biodegradable plastics break down safely in any environment, including regular landfills.",
    answer: false,
    explanation:
      "Most biodegradable plastics require specific industrial composting conditions (high heat, humidity) to break down. In a regular landfill they can persist for decades just like conventional plastic.",
  },
  {
    id: 71,
    category: "Health & Safety",
    question:
      "Burning plastic releases dioxins and furans, which are among the most toxic chemicals known to science.",
    answer: true,
    explanation:
      "Dioxins and furans are persistent organic pollutants classified as Group 1 carcinogens by the WHO. A single open burn of plastic releases concentrations far exceeding safe exposure limits.",
  },
  {
    id: 72,
    category: "Health & Safety",
    question:
      "Children are more vulnerable to the health effects of plastic-related chemical exposure than adults.",
    answer: true,
    explanation:
      "Children's developing endocrine, neurological, and immune systems are more sensitive to disruption by plastic-associated chemicals like BPA, phthalates, and heavy metals.",
  },
  {
    id: 73,
    category: "Health & Safety",
    question:
      "Plastic bags in the digestive system of cows eventually pass through safely without causing harm.",
    answer: false,
    explanation:
      "Plastic bags accumulate in ruminant stomachs and cannot be digested. They cause blockages, malnutrition, and death. This is a documented cause of cattle mortality in Nigerian markets.",
  },
  {
    id: 74,
    category: "Health & Safety",
    question:
      "Inhaling smoke from burning plastic rubbish is associated with increased risk of cancer.",
    answer: true,
    explanation:
      "Burning household plastic waste releases benzene, vinyl chloride, and polycyclic aromatic hydrocarbons (PAHs) — all known or probable carcinogens. Regular exposure significantly elevates cancer risk.",
  },
  {
    id: 75,
    category: "Health & Safety",
    question:
      "Stagnant water pooling around uncollected plastic waste creates breeding sites for malaria mosquitoes.",
    answer: true,
    explanation:
      "Plastic containers, sachets, and bags collect rainwater and create ideal breeding conditions for Anopheles mosquitoes. This is a significant malaria transmission risk factor in urban Nigeria.",
  },
  {
    id: 76,
    category: "Health & Safety",
    question:
      "Washing hands after handling plastic waste before touching food is an important hygiene practice.",
    answer: true,
    explanation:
      "Plastic waste often carries bacteria, chemical residues, and pathogen-contaminated organic matter. Handwashing prevents transfer of these hazards to food and mucous membranes.",
  },
  {
    id: 77,
    category: "Health & Safety",
    question:
      "Lead, mercury, and cadmium are found in some types of electronic waste and are harmful to human health.",
    answer: true,
    explanation:
      "E-waste contains significant concentrations of heavy metals. Lead damages brain development in children. Mercury affects the nervous system. Cadmium causes kidney damage.",
  },
  {
    id: 78,
    category: "Health & Safety",
    question:
      "Open waste dumps near homes are associated with higher rates of diarrhoea and gastrointestinal illness in children.",
    answer: true,
    explanation:
      "Proximity to open dumps exposes children to fly-borne pathogens, contaminated soil, and leachate runoff into groundwater. Studies confirm elevated diarrhoea rates in affected communities.",
  },
  {
    id: 79,
    category: "Health & Safety",
    question:
      "Wearing gloves when handling large quantities of waste for community clean-up exercises is unnecessary as long as you wash hands afterward.",
    answer: false,
    explanation:
      "Gloves protect against sharps (glass, syringes), corrosive chemicals, and skin absorption of hazardous substances. Washing hands alone does not provide adequate protection during handling.",
  },
  {
    id: 80,
    category: "Health & Safety",
    question:
      "Plastic packaging marked as 'food safe' can be reused indefinitely for food storage.",
    answer: false,
    explanation:
      "Repeated washing, heating, and mechanical stress degrade 'food safe' plastics over time, increasing chemical leaching. Most food-grade plastic containers have recommended maximum reuse durations.",
  },
  {
    id: 81,
    category: "Health & Safety",
    question:
      "Using a reusable water bottle instead of buying plastic sachets daily reduces both plastic waste and personal health risk.",
    answer: true,
    explanation:
      "Reusable bottles reduce plastic exposure and save money. Additionally, many pure water sachets in Nigeria are filled without proper treatment — a reusable bottle with filtered water can be a safer choice.",
  },
  {
    id: 82,
    category: "Health & Safety",
    question:
      "People who live near plastic waste recycling facilities have no significant health risks.",
    answer: false,
    explanation:
      "Informal recycling often involves burning plastic insulation or open acid baths. Communities near informal recycling sites show elevated heavy metal levels and respiratory issues.",
  },
  {
    id: 83,
    category: "Health & Safety",
    question:
      "Cutting plastic waste injury risk during community clean-ups requires closed-toe shoes and puncture-resistant gloves.",
    answer: true,
    explanation:
      "Broken glass, metal fragments, and sharp plastic are common in waste sites. Proper footwear and gloves are minimum safety requirements for any waste clean-up activity.",
  },
  {
    id: 84,
    category: "Health & Safety",
    question:
      "Noise pollution from waste collection vehicles is a recognised health concern in urban areas.",
    answer: true,
    explanation:
      "Prolonged exposure to noise above 85 decibels causes hearing damage. Waste truck drivers and compactor operators are among the most noise-exposed occupational groups.",
  },
  {
    id: 85,
    category: "Health & Safety",
    question:
      "Mental health can be negatively affected by living in a neighbourhood with high levels of visible waste and environmental degradation.",
    answer: true,
    explanation:
      "Environmental psychology research consistently links visible waste and degraded environments to increased stress, anxiety, and reduced sense of community wellbeing.",
  },
  {
    id: 86,
    category: "Community Action",
    question:
      "Reporting a waste hotspot on EarthMender AI automatically notifies the relevant waste operator.",
    answer: true,
    explanation:
      "Operator-role users on EarthMender see all open reports and can assign, resolve, and track cases. The platform creates a direct link between citizen reports and operational response.",
  },
  {
    id: 87,
    category: "Community Action",
    question:
      "A single person reporting waste consistently over time can create enough data to demonstrate a chronic hotspot to local government.",
    answer: true,
    explanation:
      "EarthMender's recurrence multiplier identifies zones reported multiple times. Consistent reporting builds an evidence base that is difficult for authorities to ignore.",
  },
  {
    id: 88,
    category: "Community Action",
    question:
      "Community clean-up events have no lasting impact if waste infrastructure is not also improved.",
    answer: true,
    explanation:
      "Without adequate bins, collection schedules, and enforcement, cleaned areas quickly return to their previous state. Clean-ups must be paired with systemic infrastructure change.",
  },
  {
    id: 89,
    category: "Community Action",
    question:
      "NYSC corps members can use their Community Development Service (CDS) year to make a documented environmental impact through waste reporting.",
    answer: true,
    explanation:
      "EarthMender's GPS-tagged, timestamped reports provide verifiable records of environmental service. This is an ideal CDS platform for environmentally-focused corps groups.",
  },
  {
    id: 90,
    category: "Community Action",
    question:
      "Talking to a neighbour about proper waste disposal is less effective than reporting waste to an authority.",
    answer: false,
    explanation:
      "Peer-to-peer community influence is among the most effective behaviour change mechanisms. A respected neighbour's nudge often changes behaviour faster than a distant authority's directive.",
  },
  {
    id: 91,
    category: "Community Action",
    question:
      "Schools that incorporate environmental education show measurable changes in student waste disposal behaviour.",
    answer: true,
    explanation:
      "Multiple studies confirm that students who receive structured environmental education are more likely to recycle, report waste, and influence their household's waste practices.",
  },
  {
    id: 92,
    category: "Community Action",
    question:
      "Advocacy and policy pressure from communities has led to plastic bans and environmental laws in several countries.",
    answer: true,
    explanation:
      "Community campaigns have directly influenced plastic bag bans in Kenya, Rwanda, and several Nigerian states. Citizen pressure is a proven driver of environmental policy.",
  },
  {
    id: 93,
    category: "Community Action",
    question:
      "Organising a waste sorting system in your compound or estate is a community-level intervention that reduces contamination of recyclable materials.",
    answer: true,
    explanation:
      "Estate-level sorting (dry recyclables, organic, hazardous) enables cleaner waste streams and makes collection more efficient. It also reduces contamination that causes recyclables to be sent to landfill.",
  },
  {
    id: 94,
    category: "Community Action",
    question:
      "Waste management is purely a government responsibility and citizens have no role to play.",
    answer: false,
    explanation:
      "Effective waste management requires all stakeholders — citizens, businesses, civil society, and government. Citizen participation in reporting, sorting, and reducing waste is essential.",
  },
  {
    id: 95,
    category: "Community Action",
    question:
      "Corporate Social Responsibility (CSR) budgets from large Nigerian companies can be directed toward community waste management initiatives.",
    answer: true,
    explanation:
      "Many Nigerian companies are required to demonstrate CSR activity. Community clean-ups, recycling station sponsorship, and environmental education partnerships are eligible CSR activities.",
  },
  {
    id: 96,
    category: "Community Action",
    question:
      "Social media campaigns about waste have proven effective at changing public behaviour in Nigerian cities.",
    answer: true,
    explanation:
      "Viral campaigns like #CleanUpNigeria and neighbourhood-level WhatsApp group awareness drives have documented impacts on reporting rates and public participation in clean-up events.",
  },
  {
    id: 97,
    category: "Community Action",
    question:
      "A community that consistently keeps its environment clean tends to see lower rates of crime and higher property values.",
    answer: true,
    explanation:
      "The 'broken windows theory' has empirical support — clean, well-maintained environments signal care and ownership, reducing criminal behaviour and increasing neighbourhood desirability.",
  },
  {
    id: 98,
    category: "Community Action",
    question:
      "Individual action against plastic pollution is pointless because companies produce too much plastic for individuals to make a difference.",
    answer: false,
    explanation:
      "While systemic change is critical, individual behaviour drives demand, community norms, and political will. Individual action also aggregates: 50 million Nigerians each reducing by one sachet per day is 50 million fewer sachets daily.",
  },
  {
    id: 99,
    category: "Community Action",
    question:
      "EarthMender AI's GPS-tagged reports can be used as evidence in local government budget advocacy for improved waste infrastructure.",
    answer: true,
    explanation:
      "Georeferenced, timestamped data is exactly what councillors, NGOs, and journalists need to make evidence-based demands of local authorities. Data transforms anecdotal complaints into verifiable evidence.",
  },
  {
    id: 100,
    category: "Community Action",
    question:
      "Volunteering for one community clean-up exercise has been shown to increase long-term environmental behaviour change in participants.",
    answer: true,
    explanation:
      "Participation in clean-up events creates emotional investment and a sense of ownership over shared spaces. Participants report sustained changes in their personal waste habits afterward.",
  },
  {
    id: 101,
    category: "Climate & Circular Economy",
    question:
      "Plastic production currently accounts for approximately 4% of global oil and gas consumption.",
    answer: true,
    explanation:
      "Plastic is derived from fossil fuels (mainly naphtha from oil refining). At current growth rates, plastic production could account for 20% of global oil consumption by 2050.",
  },
  {
    id: 102,
    category: "Climate & Circular Economy",
    question:
      "A circular economy for plastic means that plastic is kept in use as long as possible rather than discarded after a single use.",
    answer: true,
    explanation:
      "The circular economy model designs out waste by keeping materials in productive use through reuse, repair, and recycling — contrasted with the current 'take-make-dispose' linear model.",
  },
  {
    id: 103,
    category: "Climate & Circular Economy",
    question:
      "Verified plastic waste collection data can be converted into carbon credits that can be sold on carbon markets.",
    answer: true,
    explanation:
      "Preventing plastic from entering waterways or being burned has a measurable carbon equivalent value. Platforms like Plastic Credit Exchange allow verified waste collection to generate tradeable carbon credits.",
  },
  {
    id: 104,
    category: "Climate & Circular Economy",
    question:
      "Nigeria's high sun intensity makes it well-suited for solar-powered waste collection and sorting facilities.",
    answer: true,
    explanation:
      "Nigeria receives 3,500–7,000 hours of sunshine per year. Solar energy is increasingly viable for powering waste processing facilities, reducing operational costs and carbon footprint.",
  },
  {
    id: 105,
    category: "Climate & Circular Economy",
    question:
      "Green jobs in waste management and recycling are a significant employment opportunity for Nigerian youth.",
    answer: true,
    explanation:
      "The African Development Bank estimates that transitioning to a circular economy could create 3+ million jobs in Africa by 2030, particularly in waste collection, sorting, and processing.",
  },
  {
    id: 106,
    category: "Climate & Circular Economy",
    question:
      "Waste-to-energy incineration with modern scrubbers is preferable to landfilling plastic waste that cannot be recycled.",
    answer: true,
    explanation:
      "Modern waste-to-energy facilities with proper emissions control capture the calorific value of non-recyclable plastics while treating toxic gases. They are preferable to landfill but remain inferior to reduction and recycling.",
  },
  {
    id: 107,
    category: "Climate & Circular Economy",
    question:
      "Refusing unnecessary plastic (e.g. declining a plastic bag you don't need) is ranked higher than recycling in the waste hierarchy.",
    answer: true,
    explanation:
      "The waste hierarchy (Refuse, Reduce, Reuse, Recycle, Recover, Dispose) places Refusal at the top. Preventing waste generation in the first place is always more impactful than managing it after creation.",
  },
  {
    id: 108,
    category: "Climate & Circular Economy",
    question:
      "The UN Global Plastics Treaty currently being negotiated could require countries including Nigeria to reduce plastic production.",
    answer: true,
    explanation:
      "The Intergovernmental Negotiating Committee (INC) is working toward a legally binding global treaty on plastic pollution that could mandate production caps, design standards, and national action plans.",
  },
  {
    id: 109,
    category: "Climate & Circular Economy",
    question:
      "Bamboo, cassava starch, and other plant-based materials can replace plastic in some packaging applications.",
    answer: true,
    explanation:
      "Bio-based alternatives to plastic are commercially available and growing. Nigeria's agricultural base (cassava, sugarcane) provides feedstocks for bioplastic production — a potential local industry.",
  },
  {
    id: 110,
    category: "Climate & Circular Economy",
    question:
      "Extended Producer Responsibility (EPR) means that consumers, not manufacturers, are solely responsible for managing plastic packaging at end of life.",
    answer: false,
    explanation:
      "EPR places legal and financial responsibility on producers and importers of plastic packaging to fund its collection and recycling. It is the opposite of placing the burden solely on consumers.",
  },
  {
    id: 111,
    category: "EarthMender Platform",
    question:
      "EarthMender AI uses a YOLOv8 model to detect and classify plastic waste in photos.",
    answer: true,
    explanation:
      "EarthMender uses a YOLOv8n (nano) model trained on 5 Nigerian waste classes, achieving 0.698 mAP50. It runs at imgsz=320 for fast inference on low-resource servers.",
  },
  {
    id: 112,
    category: "EarthMender Platform",
    question: "EarthMender AI can detect exactly 5 types of plastic waste.",
    answer: true,
    explanation:
      "The 5 classes are: plastic_bottle, water_sachet, polythene_bag, disposable, and waste_container. These cover the most common plastic waste types found in Nigerian urban environments.",
  },
  {
    id: 113,
    category: "EarthMender Platform",
    question:
      "Taking a blurry or dark photo will give you the same detection accuracy as a clear, well-lit photo on EarthMender.",
    answer: false,
    explanation:
      "EarthMender includes an image quality check that detects blur (Laplacian variance) and brightness. Poor quality images are flagged with a warning because they reduce detection accuracy.",
  },
  {
    id: 114,
    category: "EarthMender Platform",
    question:
      "Every waste report on EarthMender AI is automatically GPS-tagged with your location.",
    answer: true,
    explanation:
      "EarthMender captures latitude and longitude (via HTML5 watchPosition or manual entry) and stores them with every report. This enables the pollution map and hotspot analysis.",
  },
  {
    id: 115,
    category: "EarthMender Platform",
    question:
      "Operator users on EarthMender can resolve open waste reports and add resolution notes.",
    answer: true,
    explanation:
      "The Operator dashboard shows all open cases, allows filtering by severity, and provides a resolve workflow with a mandatory note field (e.g. 'Area cleaned and waste removed').",
  },
  {
    id: 116,
    category: "EarthMender Platform",
    question:
      "EarthMender's pollution heatmap weights recent reports more heavily than older ones.",
    answer: true,
    explanation:
      "The mapper applies time-decay weighting using exponential decay (halving every 14 days). A report from yesterday glows hotter than the same report from last month.",
  },
  {
    id: 117,
    category: "EarthMender Platform",
    question:
      "The 'water_sachet' class has the highest detection accuracy of all 5 EarthMender waste classes.",
    answer: false,
    explanation:
      "Water sachet is the weakest class with mAP50 of 0.463 due to limited training data. Polythene bag (0.852) and plastic bottle (0.791) are the strongest classes.",
  },
  {
    id: 118,
    category: "EarthMender Platform",
    question:
      "EarthMender AI can export all collected waste report data as a CSV file for use by researchers and NGOs.",
    answer: true,
    explanation:
      "The Stats tab includes an Export section that generates a full CSV with all reports (anonymised), including GPS coordinates, waste types, severity, and resolution status.",
  },
  {
    id: 119,
    category: "EarthMender Platform",
    question:
      "A HIGH severity rating on EarthMender means the reported waste includes large containers or multiple heavy items.",
    answer: true,
    explanation:
      "Severity is calculated by summing item weight scores: waste_container scores 4, disposable scores 2, and others score 1. Reports scoring above 7 are flagged HIGH severity.",
  },
  {
    id: 120,
    category: "EarthMender Platform",
    question:
      "The EarthMender platform was built as part of the 3MTT NextGen Knowledge Showcase under the Environment Pillar.",
    answer: true,
    explanation:
      "EarthMender AI was developed by Adeniji Yusuf, a Mechanical Engineering undergraduate at FUNAAB, as an AI/ML track submission to the 3MTT NextGen Cohort 2026 programme.",
  },
] as const;

export function getQuestionsByCategory(category: string) {
  return quizBank.filter((q) => q.category === category);
}

export function getRandomSample(count: number, category?: string) {
  const pool = category ? getQuestionsByCategory(category) : quizBank;
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

