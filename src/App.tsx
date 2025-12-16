import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, Play, Pause, SkipForward, CheckCircle, XCircle, AlertCircle, Settings, BookOpen, Trophy, RotateCcw, Home, Gauge, X, ChevronDown, TrendingUp, Target, Award } from 'lucide-react';
import './App.css';

// New hierarchical structure with parent categories
const WORD_CATEGORIES_HIERARCHICAL:  Record<string, Record<string, string[]>> = {
  "Time, Dates & Numbers": {
    "Days":  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "Times": ["Weekdays", "Weekend", "Midday", "Midnight", "Fortnight", "Millennium", "Century", "Decade", "Gap Year"],
    "Months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "Measurement": ["Altitude", "Breadth", "Depth", "Width", "Height", "Length", "Mass", "Frequency", "Volume", "Dimension", "Imperial System", "Metric System"],
    "Geometry": ["Circular", "Curved", "Cylindrical", "Oval", "Polygon", "Rectangular", "Spherical", "Spiral", "Square", "Triangular", "Three Dimensions"]
  },
  
  "Education & Academic Context": {
    "University Life": ["Bachelor's Degree", "Diploma", "Certificate", "Dissertation", "Thesis", "Semester", "Module", "Course Outline", "Assessment", "Assignment", "Deadline", "Extension", "Graduation", "Commencement", "Alumni", "School Reunion", "Student Retention", "Placement Test", "Outcomes"],
    "Study Terms": ["Advanced", "Attendance", "Classroom", "Compound", "Computer Laboratory", "Department", "Experiment", "Extra Background", "Feedback", "Give a Talk", "Group Discussion", "Guidelines", "Higher Education", "Intermediate", "Introductory", "Knowledge", "Media Room", "Post-Secondary", "Primary", "Printer", "Proofreading", "Report Writing", "Research", "Schedule", "Secondary", "Specialist", "Speech", "Stationery", "Student Advisor", "Student Support Services", "Tasks", "Topic", "Vocabulary", "Written Work"],
    "People & Roles": ["Tutor", "Supervisor", "Advisor", "Lecturer", "Professor", "Registrar", "Faculty", "Staff", "Pupil", "Student", "Overseas Student", "Foreign Student", "International Student", "Freshman", "Senior", "Junior"],
    "Facilities": ["Campus", "Library", "Laboratory", "Lecture Hall", "Main Hall", "Computer Centre", "Dining Room", "Canteen", "Cafeteria", "Accommodation", "Homestay", "Dormitory", "Resources Room"],
    "Study Materials": ["Textbook", "Dictionary", "Handout", "Leaflet", "Questionnaire", "Survey", "Data", "Statistics", "Reference", "Bibliography", "Publication", "Encyclopedia", "Note-taking", "Pencil", "Laptop"],
    "Subjects": ["Archaeology", "Architecture", "Biology", "Business Management", "Chemistry", "Economics", "Geography", "History", "Humanities", "Law", "Literature", "Logic", "Mathematics", "Performing Arts", "Philosophy", "Physics", "Politics", "Psychology", "Science", "Visual Arts", "Anthropology", "Agriculture"]
  },
  
  "Money, Business & Marketing": {
    "Banking & Finance": ["Bank Statement", "Current Account", "Deposit", "Withdraw", "Overdraft", "Debt", "Deficit", "Interest Rate", "Loan", "Mortgage", "Investment", "Income", "Budget", "Tax", "Dividend", "Currency", "Cash", "Cheque", "Credit Card", "Debit Card", "Annuity", "Money Management", "Counterfeit Money", "Family Finances", "Finance Department", "Grace Period", "In Advance", "Interest-Free Credit", "Low-Risk Investment", "Mastercard", "Monthly Membership", "Poverty", "Public Money", "Retail Voucher", "Student Account", "Taxpayers' Money", "VISA"],
    "Shopping & Costs": ["Affordable", "Expensive", "Cheap", "Reasonable", "Refund", "Partial Refund", "Non-refundable", "Purchase", "Discount", "Special Offer", "Coupon", "Voucher", "Duty-Free", "Tuition Fees", "Annual Fee", "Distribution Costs"],
    "Business & Management": ["Marketing Strategy", "Recruitment", "Leadership", "Management", "Profit Margin", "Merchandise", "Manufacture", "Interview", "Trainee", "Internship", "Employment", "Employer", "Employee", "Colleague", "Workforce", "Technical Cooperation", "Collecting Data", "Competition", "Entertainment Industry", "Products", "Research Method"],
    "Marketing Tools": ["Business Card", "Newsletter", "Brochure", "Catalogue", "Display", "Poll", "Commercial", "Advertisement", "Mass Media", "Customer", "TV Program"]
  },
  
  "Food, Dining & Nutrition": {
    "Basic Foods": ["Water", "Juice", "Coffee", "Tea", "Soup", "Salad", "Sandwich", "Chicken", "Beef", "Pork", "Lamb", "Fish", "Sugar", "Salt", "Pepper", "Butter", "Oil", "Sauce", "Menu", "Chef", "Bread", "Rice", "Pasta", "Pizza", "Burger", "Cheese", "Yoghurt", "Egg", "Egg Yolk", "Egg White", "Meat", "Seafood", "Beans", "Nut", "Cereal", "Meal", "Salad Bar"],
    "Fruits & Vegetables": ["Apple", "Banana", "Citrus Fruit", "Orange", "Lemon", "Blackcurrant", "Tomato", "Potato", "Green Pepper", "Onion", "Garlic", "Carrot", "Vegetable", "Fruit", "Corn", "Mushroom"],
    "Diet & Nutrition": ["Balanced Diet", "Vegetarian", "Vegan", "Vitamin", "Mineral", "Zinc", "Calcium", "Calorie", "Fat", "Fiber", "Protein", "Carbohydrate", "Malnutrition", "Food Pyramid"],
    "Dining Items": ["Beverage", "Refreshment", "Starter", "Main Course", "Dessert", "Snack", "Chocolate", "Takeaway"]
  },
  
  "Health, Fitness & Body": {
    "Medical":  ["Hospital", "Clinic", "Dentistry", "Medicine", "Treatment", "Remedy", "Cure", "Disease", "Illness", "Symptom", "Infection", "Virus", "Bacteria", "Surgery", "Pharmacy", "Nursing Care", "Stress", "Nursery"],
    "Fitness": ["Exercise", "Yoga", "Tai-Chi", "Jogging", "Running", "Gym", "Workout", "Stamina", "Strength", "Keep-Fit", "Outdoor Activities", "Leisure Time", "Regular Exercise"],
    "Body":  ["Heart", "Lung", "Liver", "Muscle", "Bone", "Blood", "Skin", "Brain", "Vision"]
  },
  
  "Nature, Environment & Weather": {
    "Disasters & Weather": ["Earthquake", "Flood", "Drought", "Hurricane", "Tornado", "Typhoon", "Storm", "Avalanche", "Landslide", "Volcanic Eruption", "Disaster", "Catastrophe", "Humidity", "Moisture", "Breeze", "Wind", "Lightning", "Thunder", "Temperature", "Freezing", "Chilly", "Hot", "Dry", "Wet", "Dusty", "Weather Forecast", "Cold", "Cool", "Sticky", "Warm"],
    "Landscape": ["Mountain", "Hill", "Valley", "Cliff", "Canyon", "Desert", "Oasis", "Forest", "Jungle", "Island", "Peninsula", "Coast", "Beach", "Reef", "Lake", "River", "Pond", "Waterfall", "Dam", "Field", "Footbridge"],
    "Environmental Issues": ["Pollution", "Contamination", "Acid Rain", "Global Warming", "Greenhouse Effect", "Deforestation", "Erosion", "Desertification", "Exhaust Fumes", "Carbon Dioxide", "Waste", "Landfill", "Smog", "Burning Fossil", "Chemical-Free", "Climate", "Degradation", "Environmentally Friendly", "Nitrogen Oxide", "Ocean Currents", "Oxygen", "Sea Level", "Soil Conditioner"],
    "Energy": ["Fossil Fuel", "Coal", "Oil", "Gas", "Firewood", "Solar Power", "Wind Turbine", "Hydroelectric", "Renewable", "Power Plant", "Source of Energy", "Solar Panels"],
    "Animals": ["Mammal", "Reptile", "Bird", "Bird of Prey", "Insect", "Rodent", "Primate", "Livestock", "Poultry", "Whale", "Penguin", "Lion", "Species", "Extinct", "Genus", "Phylum", "Cetacean", "Class", "Creature", "Family", "Order", "Seabirds"],
    "Plants": ["Tree", "Trunk", "Branch", "Twig", "Leaf", "Root", "Stem", "Bark", "Flower", "Seed", "Vegetation", "Fungus", "Mushroom", "Fertilizer", "Soil", "Cluster", "Core", "Leaves"]
  },
  
  "Travel, Transportation & Places": {
    "Land Transport": ["Car", "Automobile", "Taxi", "Cab", "Bus", "School Bus", "Double-Decker Bus", "Minibus", "Single-Decker", "Coach", "Truck", "Lorry", "Tow Truck", "Forklift", "Breakdown Truck", "Van", "Tram", "Train", "Freight Train", "Goods Train", "Steam Train", "Subway", "Underground", "Tractor", "Jeep", "Camper", "Hire A Car", "Pickup", "Tanker", "Transporter"],
    "Water Transport": ["Ship", "Boat", "Ferry", "Hovercraft", "Hydrofoil", "Liner", "Canoe", "Kayak", "Dinghy", "Canal Boat", "Rowboat", "Paddle Steamer", "Cabin Cruiser", "Container Ship", "Gondola", "Lifeboat", "Narrowboat", "Punt", "Sailboat", "Shipment"],
    "Air Transport": ["Airplane", "Aircraft", "Helicopter", "Hot-Air Balloon", "Airship", "Seaplane", "Cargo Plane"],
    "Travel Terms": ["Passenger", "Crew", "Pilot", "Driver", "Ticket", "Reservation", "Visa", "Luggage", "Terminal", "Platform", "Harbour", "Airport", "Station", "View", "Souvenir", "Tourist Attraction", "Guided Tour", "Expedition", "Aquarium", "Culture", "Guest", "Memorable", "Picnic", "Single Room", "Double-Bedded Room", "Ticket Office", "Trip"],
    "Geography & Places": ["Continent", "Country", "City", "Capital", "Village", "Suburb", "Region", "Map", "Avenue", "Bridge", "Car Park", "Central Station", "City Centre", "Department Store", "Embassy", "Garden", "Lane", "Road System", "Street", "Temple", "Bookshop", "Cafe", "City Council", "Conversation Club", "Dance Studio", "Kindergarten", "Local Library", "Park", "Parliament", "Restaurant", "Sports Centre", "Swimming Pool"],
    "Continents": ["Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"],
    "Countries": ["UK", "USA", "New Zealand", "Bangladesh", "China", "France", "Germany", "Italy", "Brazil", "Egypt", "Switzerland", "Turkey", "Malaysia", "Denmark", "Greece", "India", "Indonesia", "Mexico", "Nigeria", "North Korea", "Pakistan", "Singapore", "The Dominican Republic", "The Philippines"],
    "Languages": ["English", "Bengali", "Chinese", "Mandarin", "French", "German", "Spanish", "Japanese", "Russian", "Arabic", "Hindi", "Portuguese", "Thai", "Greek", "Bilingual", "Filipino", "Italian", "Linguistics", "Persian", "Polyglot", "Punjabi", "Trilingual"]
  },
  
  "Housing, Architecture & Materials": {
    "Types of Homes": ["House", "Apartment", "Flat", "Bungalow", "Cottage", "Castle", "Palace", "Skyscraper", "Condominium", "Duplex", "Hut", "Log Cabin", "Fortress", "Dome", "Igloo", "Row House", "Terraced House", "Block of Flats", "Houseboat", "Mobile Home", "Semi-Detached House", "Storey", "Thatched Cottage", "Town House"],
    "Parts of a Building & Home Items": ["Roof", "Ceiling", "Wall", "Floor", "Window", "Door", "Balcony", "Basement", "Attic", "Garage", "Kitchen", "Bathroom", "Bedroom", "Living Room", "Hallway", "Chimney", "Fence", "Gate", "Ground Floor", "Coffee Table", "Microwave", "Oven", "Refrigerator", "Sofa"],
    "Architecture": ["Fort", "Glasshouse", "Lighthouse", "Pyramid"],
    "Materials": ["Wood", "Stone", "Brick", "Concrete", "Cement", "Steel", "Metal", "Copper", "Aluminum", "Gold", "Silver", "Glass", "Plastic", "Rubber", "Fabric", "Cotton", "Wool", "Leather", "Ceramic", "Wax", "Paper", "Fiberglass", "Composite", "Textile", "Feather", "Fur", "Glue"],
    "Rental":  ["Tenant", "Landlord", "Lease", "Rent", "Insurance", "Neighborhood"]
  },
  
  "Hobbies, Sports & Arts": {
    "Sports": ["Football", "Soccer", "Cricket", "Tennis", "Badminton", "Rugby", "Hockey", "Basketball", "Baseball", "Golf", "Swimming", "Diving", "Surfing", "Skiing", "Snowboarding", "Cycling", "Athletics", "Judo", "Archery", "Squash", "Table Tennis", "Ping-Pong", "Abseiling", "American Football", "Athlete", "Barbell", "Bodyboarding", "Bungee Jumping", "Championship", "Court", "Extreme Sports", "Gymnasium", "Hang-Gliding", "Horse Racing", "Jet-Skiing", "Kitesurfing", "Mountain Biking", "Paragliding", "Pitch", "Polo", "Press-Up", "Push-Up", "Recreation", "Show Jumping", "Skydiving", "Snooker", "Stadium", "Team", "The Discus", "The Hammer", "The High Jump", "The Javelin", "Treadmill", "Walking", "White-Water Rafting", "Windsurfing"],
    "Hobbies": ["Photography", "Painting", "Gardening", "Collecting", "Stamps", "Chess", "Hiking", "Camping", "Pottery", "Woodcarving", "Embroidery", "Orienteering", "Billiards", "Bowls", "Caving", "Climbing", "Darts", "Ice Skating", "Scuba-Diving", "Skateboarding", "Snorkeling", "Spelunking"],
    "Arts & Media": ["Music", "Concert", "Orchestra", "Band", "Vocalist", "Instrument", "Opera", "Theatre", "Cinema", "Art Gallery", "Museum", "Exhibition", "Sculpture", "Newspaper", "Radio", "Television", "Graphics", "Audience", "Ballet", "Carnival", "Classical Music", "Conductor", "Festival", "Symphony", "The Press"]
  },
  
  "Works, Jobs & Professions": {
    "Professions": ["Accountant", "Architect", "Engineer", "Doctor", "Dentist", "Teacher", "Professor", "Manager", "Secretary", "Receptionist", "Assistant", "Clerk", "Cashier", "Waiter", "Waitress", "Pilot", "Flight Attendant", "Guard", "Designer", "Decorator", "Psychologist", "Specialist", "Captain", "Craftsman", "Team Leader", "Office Assistant"],
    "Work Concepts": ["CV", "Curriculum Vitae", "Qualification", "Experience", "Skill", "Training", "Occupation", "Profession", "Vacancy", "Freelance", "Volunteer", "Staff Selection", "Workshop", "Teamwork", "Ability", "Appointment", "Confidence", "Information Desk", "Showroom", "Technical Cooperation", "Unemployed", "Vision", "Mail Address", "Work Experience"]
  },
  
  "Descriptive Words, General Concepts & Others": {
    "Devices & Tools": ["Backpack", "Breaks", "Cassette", "Device", "Digital Monitor", "Disk", "Gadget", "Helmet", "Light", "Mechanical Pencil", "Musical Instrument", "Screen", "Silicon Chip", "Wheels", "Antenna"],
    "Adjectives": ["Beautiful", "Ugly", "Clean", "Dirty", "Ancient", "Modern", "Broken", "Intact", "Dangerous", "Safe", "Comfortable", "Convenient", "Suitable", "Mandatory", "Compulsory", "Optional", "Urgent", "Essential", "Optimistic", "Pessimistic", "Realistic", "Temporary", "Permanent", "Vulnerable", "Colored", "Disappointed", "Efficient", "Luxurious", "Poor Quality", "Satisfactory", "Satisfied", "Strongly Recommended", "Confident", "Dull", "Energetic", "Exciting", "Fabulous", "Fantastic", "Flexible", "Immense", "Intensive", "Knowledgeable", "Necessary", "Practical", "Salty", "Social", "Spectacular", "Tranquil", "Various", "Vast", "Voluntary", "Western"],
    "Colors": ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Grey", "Brown", "Spotted", "Striped"],
    "Verbs": ["Build", "Develop", "Arrange", "Collect", "Discuss", "Suggest", "Support", "Train", "Review", "Revise", "Register", "Donate", "Immigrate", "Concentrate", "Persuade", "Supervise", "Borrow", "Edit", "Exhibit", "Hunt", "Learn", "Mark", "Surpass", "Touch"],
    "General Concepts": ["Activity", "Attitude", "Carriage", "Circuit", "Commerce", "Creation", "Daily Routine", "Decision", "Demonstration", "Democrats", "Dialect", "Dialogue", "Driving License", "Entrance", "Evolution", "Farewell", "Frequently Updated", "Fund-Raising Event", "Gender", "Government", "Guarantee", "Illiteracy", "Indigenous", "Individual", "Liberal Democracy", "Libertarian", "Life Expectancy", "Literary", "Lunar Calendar", "Magnet", "Man-Made", "Narrative", "Nature Conservation", "Opportunity", "Original Inhabitant", "Passport Photo", "Pedestrian Safety", "Personal Fulfillment", "Practice", "Private Sector", "Prize", "Procedures", "Process", "Proficiency", "Prototype", "Ramification", "Recipient", "Republicans", "Revolution", "Robot", "Sewer Systems", "State", "Straight", "Strike", "Sufficient", "Traffic Jams", "Ultrasound", "Umbrella", "Variety", "Videos", "Waiting List", "Welfare"]
  }
};

// Flatten for backward compatibility with existing functions
const WORD_CATEGORIES:  Record<string, string[]> = {};
Object.entries(WORD_CATEGORIES_HIERARCHICAL).forEach(([parent, subcats]) => {
  Object.entries(subcats).forEach(([subcat, words]) => {
    WORD_CATEGORIES[`${parent} > ${subcat}`] = words;
  });
});

interface CategoryStats {
  answered: number;
  correct: number;
  mistakes: number;
  percentage: number;
  completed: boolean;
}

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 0.9, label: '0.9x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.25, label: '1.25x' },
];

const IELTSListeningPractice: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ukVoices, setUkVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [allEnglishVoices, setAllEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, CategoryStats>>({});
  const [playbackSpeed, setPlaybackSpeed] = useState(0.9);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const voiceMenuRef = useRef<HTMLDivElement>(null);

  const totalAvailableWords = useMemo(() => Object.values(WORD_CATEGORIES).flat().length, []);
  const progressPercent = useMemo(() => words.length ?  ((currentIndex + 1) / words.length) * 100 : 0, [currentIndex, words.length]);

  useEffect(() => {
    const savedMistakes = localStorage.getItem('ielts_mistakes');
    const savedStats = localStorage.getItem('ielts_category_stats');
    const savedSpeed = localStorage.getItem('playback_speed');
    if (savedMistakes) try { setMistakeWords(JSON. parse(savedMistakes)); } catch (e) {}
    if (savedStats) try { setCategoryStats(JSON.parse(savedStats)); } catch (e) {}
    if (savedSpeed) setPlaybackSpeed(parseFloat(savedSpeed));
  }, []);

  useEffect(() => { localStorage.setItem('ielts_mistakes', JSON.stringify(mistakeWords)); }, [mistakeWords]);
  useEffect(() => { localStorage.setItem('ielts_category_stats', JSON.stringify(categoryStats)); }, [categoryStats]);
  useEffect(() => { localStorage.setItem('playback_speed', playbackSpeed.toString()); }, [playbackSpeed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event. target as Node)) setShowSpeedMenu(false);
      if (voiceMenuRef. current && !voiceMenuRef. current.contains(event.target as Node)) setShowVoiceMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let voicesLoaded = false;
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0 && ! voicesLoaded) return;
      voicesLoaded = true;
      const ukOnly = availableVoices.filter(v => v.lang === 'en-GB');
      setUkVoices(ukOnly);
      const englishVoices = availableVoices.filter(v => v.lang && v.lang. startsWith('en'));
      setAllEnglishVoices(englishVoices);
      const bestVoice = ukOnly.find(v => v. name.includes('Google') && v.name.includes('UK')) || ukOnly. find(v => v.name. includes('Google')) || ukOnly.find(v => v.name.includes('Microsoft') || v.name.includes('Hazel') || v.name.includes('Daniel')) || ukOnly[0] || englishVoices. find(v => v.name. includes('Google')) || englishVoices.find(v => v.lang. startsWith('en-US')) || englishVoices[0];
      setSelectedVoice(prev => prev || bestVoice || null);
      const savedVoiceName = localStorage.getItem('selected_uk_voice');
      if (savedVoiceName) {
        const savedVoice = availableVoices.find(v => v.name === savedVoiceName);
        if (savedVoice) setSelectedVoice(savedVoice);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const timeoutId = setTimeout(loadVoices, 100);
    return () => { window.speechSynthesis.onvoiceschanged = null; clearTimeout(timeoutId); };
  }, []);

  useEffect(() => { if (selectedVoice) localStorage.setItem('selected_uk_voice', selectedVoice.name); }, [selectedVoice]);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled. length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const speak = (text: string, interrupt = true) => {
    if ('speechSynthesis' in window) {
      try {
        if (interrupt) window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = playbackSpeed;
        utterance. pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      } catch (error) { console.warn('Speech synthesis error:', error); }
    }
  };

  const togglePause = () => {
    if (! ('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) {
      if (! isPaused) { window.speechSynthesis.pause(); setIsPaused(true); }
      else { window.speechSynthesis.resume(); setIsPaused(false); }
    } else { speak(words[currentIndex]); setIsPaused(false); }
  };

  const handleSpeedChange = (speed: number) => { setPlaybackSpeed(speed); setShowSpeedMenu(false); speak("Speed changed"); };
  
  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    setShowVoiceMenu(false);
    try {
      const utterance = new SpeechSynthesisUtterance("Voice changed");
      utterance.voice = voice;
      utterance. rate = playbackSpeed;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) { console.warn('Voice test error:', error); }
  };

  const forceLoadVoices = () => {
    const voices = window.speechSynthesis. getVoices();
    const ukOnly = voices.filter(v => v.lang === 'en-GB');
    const anyEnglish = voices.filter(v => v.lang && v.lang.startsWith('en'));
    setUkVoices(ukOnly);
    setAllEnglishVoices(anyEnglish);
    if (ukOnly.length > 0 || anyEnglish.length > 0) {
      const voice = ukOnly[0] || anyEnglish[0];
      setSelectedVoice(voice);
      speak('Voices loaded successfully');
    }
  };

  const handleCategoryClick = (category: string) => {
    const stats = categoryStats[category];
    const mistakeCount = getCategoryMistakeCount(category);
    if (stats?. completed && mistakeCount > 0) { setPendingCategory(category); setShowCategoryModal(true); }
    else startTest(category, 'normal');
  };

  const handleModalChoice = (mode: 'mistakes' | 'full') => {
    if (pendingCategory) {
      if (mode === 'mistakes') startTest(pendingCategory, 'mistakes');
      else startTest(pendingCategory, 'normal');
    }
    setShowCategoryModal(false);
    setPendingCategory(null);
  };

  const startTest = (category: string | null = null, mode: 'normal' | 'mistakes' = 'normal') => {
    let wordList:  string[] = [];
    let categoryName = '';
    if (mode === 'mistakes') {
      if (category) {
        const categoryWords = WORD_CATEGORIES[category] || [];
        wordList = mistakeWords.filter(word => categoryWords.includes(word));
        categoryName = `${category} - Mistakes`;
      } else { wordList = [... mistakeWords]; categoryName = 'All Mistakes'; }
    } else if (category) {
      wordList = WORD_CATEGORIES[category] ?  [...WORD_CATEGORIES[category]] : [];
      categoryName = category;
    } else { wordList = Object.values(WORD_CATEGORIES).flat(); categoryName = 'Mixed'; }
    if (wordList.length === 0) return;
    const shuffled = shuffleArray(wordList);
    setWords(shuffled);
    setIsPlaying(true);
    setCurrentIndex(0);
    setUserInput('');
    setShowResult(false);
    setScore({ correct: 0, total:  0 });
    setIsPaused(false);
    setSelectedCategory(categoryName);
    setShowResults(false);
    setTimeout(() => speak(shuffled[0]), 400);
  };

  const updateCategoryStats = (category: string, correct: number, total: number) => {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    setCategoryStats(prev => ({ ...prev, [category]: { answered: total, correct, mistakes: total - correct, percentage, completed: true } }));
  };

  const checkAnswer = () => {
    if (! userInput.trim()) return;
    const cleanInput = userInput.trim().toLowerCase();
    const cleanTarget = (words[currentIndex] || '').toLowerCase();
    const correct = cleanInput === cleanTarget;
    setIsCorrect(correct);
    setShowResult(true);
    const newScore = { correct:  score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);
    if (!correct) {
      if (! mistakeWords.includes(words[currentIndex])) setMistakeWords(prev => [...prev, words[currentIndex]]);
      speak(`Incorrect. The correct spelling is ${words[currentIndex]}`);
    } else {
      if (mistakeWords.includes(words[currentIndex])) setMistakeWords(prev => prev.filter(w => w !== words[currentIndex]));
      speak('Correct');
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setUserInput('');
          setShowResult(false);
          setIsCorrect(false);
          setTimeout(() => { inputRef.current?.focus(); speak(words[nextIdx]); }, 100);
        } else {
          const originalCategory = selectedCategory?. replace(' - Mistakes', '').replace('All Mistakes', '');
          if (originalCategory && originalCategory !== 'Mixed' && WORD_CATEGORIES[originalCategory]) {
            if (selectedCategory?. includes('Mistakes')) {
              const existing = categoryStats[originalCategory];
              if (existing) {
                const newlyFixed = newScore.correct;
                const updatedCorrect = existing.correct + newlyFixed;
                const totalWords = existing.answered;
                updateCategoryStats(originalCategory, updatedCorrect, totalWords);
              } else {
                updateCategoryStats(originalCategory, newScore.correct, newScore.total);
              }
            } else {
              updateCategoryStats(originalCategory, newScore.correct, newScore. total);
            }
          }
          setIsPlaying(false);
          setShowResults(true);
          speak(`Test completed!  You got ${newScore.correct} out of ${newScore.total}`);
        }
      }, 1500);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserInput('');
      setShowResult(false);
      setIsCorrect(false);
      setTimeout(() => { inputRef.current?.focus(); speak(words[nextIdx]); }, 300);
    } else {
      const originalCategory = selectedCategory?.replace(' - Mistakes', '').replace('All Mistakes', '');
      if (originalCategory && originalCategory !== 'Mixed' && WORD_CATEGORIES[originalCategory]) {
        if (selectedCategory?.includes('Mistakes')) {
          const existing = categoryStats[originalCategory];
          if (existing) {
            const newlyFixed = score.correct;
            const updatedCorrect = existing.correct + newlyFixed;
            const totalWords = existing.answered;
            updateCategoryStats(originalCategory, updatedCorrect, totalWords);
          } else {
            updateCategoryStats(originalCategory, score. correct, score.total);
          }
        } else {
          updateCategoryStats(originalCategory, score.correct, score.total);
        }
      }
      setIsPlaying(false);
      setShowResults(true);
      speak(`Test completed! You got ${score.correct} out of ${score.total}`);
    }
  };

  const clearMistakes = () => { if (window.confirm('Are you sure you want to clear your saved mistake words?')) setMistakeWords([]); };
  const goHome = () => { setIsPlaying(false); setShowResults(false); window.speechSynthesis.cancel(); };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isPlaying && !isPaused) {
      if (showResult) { if (! isCorrect) nextWord(); }
      else checkAnswer();
    }
  };
  
  const getCategoryMistakeCount = (category: string) => {
    const categoryWords = WORD_CATEGORIES[category] || [];
    return mistakeWords.filter(word => categoryWords.includes(word)).length;
  };

  const FloatingControls = () => (
    <div className="flex items-center gap-2">
      <div className="relative" ref={speedMenuRef}>
        <button onClick={() => { setShowSpeedMenu(! showSpeedMenu); setShowVoiceMenu(false); }} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md" title="Playback Speed">
          <Gauge size={18} />
          <span className="text-sm font-medium">{playbackSpeed}x</span>
          <ChevronDown size={16} />
        </button>
        {showSpeedMenu && (
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border-2 border-purple-200 py-2 z-50 min-w-[140px]">
            {SPEED_OPTIONS.map(option => (
              <button key={option.value} onClick={() => handleSpeedChange(option.value)} className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors flex items-center justify-between ${playbackSpeed === option.value ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`}>
                <span>{option. label}</span>
                {playbackSpeed === option.value && <CheckCircle size={16} className="text-purple-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {allEnglishVoices.length > 0 && (
        <div className="relative" ref={voiceMenuRef}>
          <button onClick={() => { setShowVoiceMenu(!showVoiceMenu); setShowSpeedMenu(false); }} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md" title="Change Voice">
            <Volume2 size={18} />
            <span className="text-sm font-medium hidden sm:inline">Voice</span>
            <ChevronDown size={16} />
          </button>
          {showVoiceMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border-2 border-indigo-200 py-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 mb-1">
                {ukVoices.length > 0 ? `UK Voices (${ukVoices.length})` : `English Voices (${allEnglishVoices.length})`}
              </div>
              {(ukVoices.length > 0 ?  ukVoices : allEnglishVoices).map(voice => (
                <button key={voice.name} onClick={() => handleVoiceChange(voice)} className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors text-sm ${selectedVoice?.name === voice.name ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className="truncate">{voice.name. split(' ')[0]}</span>
                    {selectedVoice?.name === voice.name && <CheckCircle size={14} className="text-indigo-600 flex-shrink-0 ml-2" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const SummaryCard = () => {
    const totalCategories = Object.keys(WORD_CATEGORIES).length;
    const completedCategories = Object.values(categoryStats).filter(s => s.completed).length;
    const totalWords = Object.values(WORD_CATEGORIES).flat().length;
    const allCompletedStats = Object.values(categoryStats).filter(s => s.completed);
    const totalAnswered = allCompletedStats. reduce((sum, s) => sum + s.answered, 0);
    const totalCorrect = allCompletedStats. reduce((sum, s) => sum + s.correct, 0);
    const totalMistakes = mistakeWords.length;
    const overallPercentage = totalAnswered > 0 ? Math. round((totalCorrect / totalAnswered) * 100) : 0;
    
    return (
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} />
            <h2 className="text-2xl font-bold">Overall Progress</h2>
          </div>
          <div className="text-sm opacity-90">{completedCategories}/{totalCategories} Categories</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="opacity-80" />
              <span className="text-sm opacity-90">Total Tests</span>
            </div>
            <div className="text-3xl font-bold">{completedCategories}</div>
            <div className="text-xs opacity-75 mt-1">of {totalCategories} categories</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="opacity-80" />
              <span className="text-sm opacity-90">Overall Score</span>
            </div>
            <div className="text-3xl font-bold">{overallPercentage}%</div>
            <div className="text-xs opacity-75 mt-1">{totalCorrect}/{totalAnswered} correct</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="opacity-80" />
              <span className="text-sm opacity-90">Words Mastered</span>
            </div>
            <div className="text-3xl font-bold">{totalCorrect}</div>
            <div className="text-xs opacity-75 mt-1">of {totalWords} words</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={20} className="opacity-80" />
              <span className="text-sm opacity-90">To Review</span>
            </div>
            <div className="text-3xl font-bold">{totalMistakes}</div>
            <div className="text-xs opacity-75 mt-1">mistakes to fix</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-90 mb-1">
            <span>Progress</span>
            <span>{completedCategories}/{totalCategories} Complete</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  const CategoryModal = () => {
    if (! showCategoryModal || !pendingCategory) return null;
    const stats = categoryStats[pendingCategory];
    const mistakeCount = getCategoryMistakeCount(pendingCategory);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{pendingCategory}</h3>
            <button onClick={() => { setShowCategoryModal(false); setPendingCategory(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="mb-6">
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">Last Score</div>
              <div className="text-3xl font-bold text-green-600">{stats?. percentage}%</div>
              <div className="text-sm text-gray-600 mt-1">{stats?.correct}/{stats?.answered} correct</div>
            </div>
            {mistakeCount > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-600 font-medium">You have {mistakeCount} mistake{mistakeCount !== 1 ? 's' :  ''} to review</div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button onClick={() => handleModalChoice('mistakes')} className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <AlertCircle size={24} />
              Review {mistakeCount} Mistake{mistakeCount !== 1 ? 's' : ''}
            </button>
            <button onClick={() => handleModalChoice('full')} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Play size={24} />
              Take Full Test Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryGrid = () => (
    <>
      <SummaryCard />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button onClick={() => startTest(null, 'normal')} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left flex flex-col justify-between h-32">
          <span className="text-2xl font-bold"><Play className="inline mr-2"/>All Categories</span>
          <span className="opacity-80 text-sm">Mix of {totalAvailableWords} words</span>
        </button>
        {mistakeWords.length > 0 && (
          <button onClick={() => startTest(null, 'mistakes')} className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left flex flex-col justify-between h-32">
            <span className="text-2xl font-bold"><AlertCircle className="inline mr-2"/>Review Mistakes</span>
            <span className="opacity-80 text-sm">{mistakeWords.length} words to fix</span>
          </button>
        )}
      </div>
      
      {Object.entries(WORD_CATEGORIES_HIERARCHICAL).map(([parentCat, subcats]) => (
        <div key={parentCat} className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b-2 border-purple-300 pb-2">
            <BookOpen className="text-purple-600" size={28} />
            {parentCat}
          </h3>
          
          <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subcats).map(([subcat, words]) => {
              const fullKey = `${parentCat} > ${subcat}`;
              const stats = categoryStats[fullKey];
              const mistakeCount = getCategoryMistakeCount(fullKey);
              const isCompleted = stats?.completed;
              
              return (
                <div key={fullKey} className="relative">
                  <button
                    onClick={() => handleCategoryClick(fullKey)}
                    className={`w-full p-6 rounded-xl hover:shadow-md transition-all text-left flex flex-col justify-between h-32 group ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300' 
                        : 'bg-white border-2 border-purple-100 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-lg font-semibold ${
                        isCompleted ? 'text-green-700' : 'text-gray-700 group-hover:text-purple-600'
                      }`}>
                        {subcat}
                      </span>
                      {isCompleted && <CheckCircle className="text-green-600" size={24} />}
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-sm">{words. length} words</span>
                      {stats && (
                        <div className="text-sm font-semibold text-green-600">
                          {stats.percentage}% • {stats.correct}/{stats.answered}
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {mistakeCount > 0 && (
                    <div
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg"
                      title={`${mistakeCount} mistakes`}
                    >
                      {mistakeCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );

  const renderResultsScreen = () => {
    const finalCorrect = score.correct;
    const finalTotal = score.total;
    const finalMistakes = finalTotal - finalCorrect;
    const percentage = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
            <Trophy className="text-white" size={48} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Test Completed!</h2>
          <p className="text-gray-500">{selectedCategory}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">{percentage}%</div>
            <p className="text-gray-600">Overall Score</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{finalTotal}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{finalCorrect}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{finalMistakes}</div>
              <div className="text-sm text-gray-600">Mistakes</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={goHome} className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
            <Home size={24} />
            Back to Home
          </button>
          <button onClick={() => { const cleanCategory = selectedCategory?. replace(' - Mistakes', '').replace('All Mistakes', ''); startTest(cleanCategory || null, 'normal'); }} className="flex-1 bg-white border-2 border-purple-500 text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={24} />
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <CategoryModal />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">IELTS Spelling Master</h1>
          <p className="text-gray-500">Sharpen your listening skills for the exam</p>
        </header>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {! isPlaying && ! showResults && (
            <div className="bg-purple-50 p-4 border-b border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-800 font-medium">
                  <Settings size={20} />
                  <span>Settings</span>
                </div>
                <FloatingControls />
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-2"><strong>✅ Currently using:</strong></p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Voice:  </span>
                    <span className="font-medium text-purple-600">{selectedVoice?. name || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Speed: </span>
                    <span className="font-medium text-purple-600">{playbackSpeed}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{ukVoices.length > 0 ? 'UK Voices: ' : 'English Voices:'}</span>
                    <span className="font-medium text-green-600">{ukVoices.length > 0 ? ukVoices.length : allEnglishVoices.length}</span>
                  </div>
                </div>
                {ukVoices.length === 0 && allEnglishVoices.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 mb-1">ℹ️ No UK voices available</p>
                    <p className="text-xs text-gray-600">✅ Using {allEnglishVoices. length} English voice{allEnglishVoices. length > 1 ? 's' :  ''} as fallback</p>
                  </div>
                )}
                {allEnglishVoices.length === 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 mb-2">⚠️ No voices detected</p>
                    <button onClick={forceLoadVoices} className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">🔄 Load Voices</button>
                  </div>
                )}
              </div>
              {mistakeWords.length > 0 && (
                <div className="mt-4 text-center">
                  <button onClick={clearMistakes} className="text-xs text-red-500 hover:text-red-700 underline">Clear Mistake History</button>
                </div>
              )}
            </div>
          )}
          <div className="p-6 md:p-10">
            {showResults ?  renderResultsScreen() : !isPlaying ? (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="text-purple-500"/>Select a Category to Practice
                </h2>
                {renderCategoryGrid()}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2. 5 mb-6">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="flex justify-between items-center mb-8 text-sm">
                  <span className="text-gray-600">Category: <strong className="text-purple-600">{selectedCategory}</strong></span>
                  <div className="flex items-center gap-3">
                    <FloatingControls />
                    <span className="text-gray-600">Progress: <strong className="text-purple-600">{currentIndex + 1}/{words.length}</strong></span>
                  </div>
                </div>
                <div className="text-center mb-8">
                  <button onClick={() => { window.speechSynthesis.cancel(); speak(words[currentIndex]); setIsPaused(false); }} className="group relative inline-flex items-center justify-center p-4 px-8 py-4 overflow-hidden font-medium text-purple-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group hover:bg-purple-50" aria-label="Replay audio">
                    <Volume2 size={32} className={`mr-2 ${isPaused ? 'opacity-50' : 'animate-pulse'}`} />
                    <span className="text-lg">Replay Audio</span>
                  </button>
                </div>
                <div className="relative mb-6">
                  <input ref={inputRef} type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown} disabled={showResult || isPaused} className={`w-full text-center text-3xl font-bold py-4 border-b-4 focus:outline-none bg-transparent transition-colors ${showResult ?  isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700' : 'border-gray-300 focus:border-purple-500 text-gray-800'}`} placeholder="Type here..." autoFocus autoComplete="off" autoCorrect="off" spellCheck={false} aria-label="Type your answer" />
                </div>
                <div className="h-24 mb-6 text-center">
                  {showResult && (
                    <div className={`transform transition-all duration-300 ${isCorrect ? 'scale-100' : 'shake'}`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle size={28} />
                          <span className="text-2xl font-bold">Correct!  </span>
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <XCircle size={28} />
                            <span className="text-2xl font-bold">Incorrect</span>
                          </div>
                          <p className="text-gray-600">Correct spelling: <span className="font-mono font-bold text-red-600 text-xl tracking-wide">{words[currentIndex]}</span></p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  {! showResult ?   (
                    <>
                      <button onClick={checkAnswer} disabled={!userInput. trim()} className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all transform hover:-translate-y-1">Check Answer</button>
                      <button onClick={togglePause} className="px-6 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors" aria-label={isPaused ? 'Resume audio' : 'Pause audio'}>{isPaused ? <Play /> : <Pause />}</button>
                    </>
                  ) : (
                    <>{! isCorrect && (
                      <button onClick={nextWord} autoFocus className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2">Next Word <SkipForward size={20} /></button>
                    )}</>
                  )}
                </div>
                <div className="mt-8 text-center">
                  <button onClick={goHome} className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors">Exit Test</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IELTSListeningPractice;
