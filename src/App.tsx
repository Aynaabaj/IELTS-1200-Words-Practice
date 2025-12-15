Here's the **complete updated App.tsx** with mobile voice support:

```typescript
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, Play, Pause, SkipForward, CheckCircle, XCircle, AlertCircle, Settings, BookOpen, Trophy, RotateCcw, Home, Gauge, X, ChevronDown, TrendingUp, Target, Award } from 'lucide-react';
import './App.css';

// --- DATA STRUCTURE (Complete Word List) ---
const WORD_CATEGORIES:  Record<string, string[]> = {
  "Days of the Week": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekdays", "Weekend"],
  
  "Months of the Year": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  
  "Money Matters": ["Annual Fee", "Annuity", "Bank Statement", "Budget Deficit", "Cash", "Cheque", "Counterfeit Money", "Coupon", "Credit Card", "Current Account", "Debit", "Debt", "Deposit", "Distribution Costs", "Duty-Free Store", "Family Finances", "Finance Department", "Grace Period", "In Advance", "Income", "Interest Rate", "Interest-Free Credit", "Low-Risk Investment", "Mastercard", "Money Management", "Monthly Membership", "Mortgage", "Non-Refundable", "Partial Refund", "Poverty", "Public Money", "Purchase", "Retail Voucher", "Student Account", "Taxpayers' Money", "Tuition Fees", "VISA", "Withdraw"],
  
  "Subjects": ["Agriculture", "Anthropology", "Archaeology", "Architecture", "Biology", "Business Management", "Chemistry", "Economics", "Geography", "History", "Humanities", "Law", "Literature", "Logic", "Mathematics", "Performing Arts", "Philosophy", "Physics", "Politics", "Psychology", "Science", "Statistics", "Visual Arts"],
  
  "Studying At College/University": ["Accommodation", "Advanced", "Assessment", "Attendance", "Bachelor's Degree", "Certificate", "Classroom", "College", "Commencement", "Compound", "Computer Centre", "Computer Laboratory", "Course Outline", "Deadline", "Department", "Dictionary", "Dining Room", "Diploma", "Dissertation", "Experiment", "Experience", "Extra Background", "Facilities", "Faculty", "Feedback", "Foreign Students", "Full-Time", "Give a Talk", "Group Discussion", "Guidelines", "Handout", "Higher Education", "Home Stay", "Intermediate", "International", "Introductory", "Knowledge", "Laptop", "Leaflet", "Lecture", "Library", "Main Hall", "Media Room", "Module", "Outcomes", "Overseas Students", "Pencil", "Placement Test", "Post-Secondary", "Primary", "Printer", "Proofreading", "Publication", "Pupils", "Reference", "Registrar's Office", "Report Writing", "Research", "Resources Room", "Schedule", "School Reunion", "Secondary", "Specialist", "Speech", "Staff", "Stationery", "Student Advisor", "Student Retention", "Student Support Services", "Supervisor", "Tasks", "Teamwork", "Textbook", "Topic", "Tutor", "Vocabulary", "Written Work"],
  
  "Marketing": ["Business Card", "Catalogue", "Collecting Data", "Competition", "Customer", "Display", "Entertainment Industry", "Interview", "Leadership", "Management", "Manufacture", "Marketing Strategies", "Mass Media", "Merchandise", "Newsletter", "Poll", "Products", "Profit Margin", "Questionnaire", "Recruitment", "Research Method", "Special Offer", "Statistic", "Survey", "Trainee", "Training", "TV Program"],
  
  "Health": ["Balanced Diet", "Beans", "Blackcurrant", "Bread", "Carbohydrates", "Cereals", "Cheese", "Citrus Fruits", "Disease", "Egg Yolk", "Eggs", "Food Pyramid", "Fruit", "Green Pepper", "Keep-Fit", "Leisure Time", "Liver", "Meal", "Meat", "Medicine Treatment", "Milk", "Minerals", "Nursery", "Nursing Care", "Nuts", "Outdoor Activities", "Pasta", "Pizza", "Potatoes", "Protein", "Regular Exercise", "Remedy", "Rice", "Salad Bar", "Seafood", "Tai-Chi", "Tomatoes", "Vegetables", "Vegetarian", "Vitamin", "Yoghurt", "Yoga", "Zinc"],
  
  "Nature": ["Avalanche", "Canyon", "Catastrophe", "Cliff", "Coast", "Dam", "Desertification", "Disaster", "Earthquake", "Environment", "Erosion", "Field", "Flood", "Footbridge", "Forest", "Hill", "Hurricane", "Island", "Jungle", "Lake", "Landslides", "Mountain", "Oasis", "Peninsula", "Pond", "Reef", "River", "Storm", "Tornado", "Typhoon", "Valley", "Village", "Volcano", "Waterfall"],
  
  "The Environment": ["Acid Rain", "Burning Fossil", "Carbon Dioxide", "Cattle", "Chemical-Free", "Climate", "Coal", "Contaminated", "Deforestation", "Degradation", "Desert", "Drought", "Environmentally Friendly", "Exhaust Fumes", "Firewood", "Fossil Fuels", "Global Warming", "Greenhouse Effect", "Hydroelectric Power", "Landfill", "Nitrogen Oxide", "Ocean Currents", "Oxygen", "Pollution", "Power Plants", "Reliable", "Renewable", "Sea Level", "Smog", "Soar Power", "Soil Conditioner", "Solar Panels", "Source Of Energy", "Temperature", "Vegetation", "Wind Turbine"],
  
  "The Animal Kingdom": ["Amphibian", "Birds of Prey", "Cetacean", "Class", "Creature", "Family", "Fish", "Genus", "Insects", "Lion", "Livestock", "Mammals", "Octopus", "Order", "Penguin", "Phylum", "Poultry and Game", "Primates", "Reptile", "Rodents", "Seabirds", "Species", "Whale"],
  
  "Plants": ["Bark", "Branch", "Cluster", "Core", "Fertilizer", "Flower", "Fungus", "Leaves", "Mushroom", "Roots", "Seed", "Stem", "Trunk", "Twig"],
  
  "Continents": ["Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"],
  
  "Countries": ["Brazil", "China", "Denmark", "Egypt", "England", "France", "Germany", "Greece", "India", "Indonesia", "Italy", "Malaysia", "Mexico", "New Zealand", "Nigeria", "North Korea", "Pakistan", "Singapore", "Switzerland", "The Dominican Republic", "The Philippines", "Turkey", "United Kingdom"],
  
  "Languages": ["Bengali", "Bilingual", "Chinese", "Filipino", "French", "German", "Greek", "Hindi", "Italian", "Japanese", "Linguistics", "Mandarin", "Persian", "Polyglot", "Portuguese", "Punjabi", "Russian", "Thai", "Trilingual"],
  
  "Architecture and Buildings": ["Castle", "Dome", "Fort", "Glasshouse", "Hut", "Lighthouse", "Log Cabin", "Palace", "Pyramid", "Sculpture", "Skyscraper"],
  
  "Homes": ["Apartment Building", "Basement", "Bedroom", "Block of Flats", "Bungalow", "Chimney", "Coffee Table", "Condominium", "Dormitory", "Duplex", "Ground Floor", "Hallway", "Houseboat", "Insurance", "Kitchen", "Landlord", "Lease", "Microwave", "Mobile Home", "Neighborhood", "Oven", "Refrigerator", "Rent", "Row House", "Semi-Detached House", "Sofa", "Storey", "Suburb", "Tenant", "Terraced House", "Thatched Cottage", "Town House"],
  
  "In The City": ["Avenue", "Bridge", "Car Park", "Central Station", "Cities", "City Centre", "Department Store", "Embassy", "Garden", "Hospital", "Lane", "Road System", "Street", "Temple"],
  
  "Workplaces": ["Ability", "Appointment", "Clinic", "Colleague", "Confidence", "Dentist", "Employee", "Employer", "Employment", "Information Desk", "Internship", "Reception", "Showroom", "Staff Selection", "Stress", "Team Leaders", "Technical Cooperation", "Unemployed", "Vision", "Workshop"],
  
  "Rating and Qualities": ["Cheap", "Colored", "Dangerous", "Disappointed", "Efficient", "Expensive", "Luxurious", "Poor Quality", "Reasonable", "Safe", "Satisfactory", "Satisfied", "Spotted", "Striped", "Strongly Recommended"],
  
  "Touring": ["Aquarium", "Culture", "Guest", "Hostel", "Memorable", "Picnic", "Reservation", "Single Double-Bedded Room", "Souvenir", "Suite", "Ticket Office", "Tourist Attraction", "Tourist Guided Tour", "Trip", "View"],
  
  "Verbs": ["Arrange", "Borrow", "Collect", "Concentrate", "Develop", "Discuss", "Donate", "Edit", "Exhibit", "Hunt", "Immigrate", "Learn", "Mark", "Persuade", "Register", "Review", "Revise", "Suggest", "Supervise", "Support", "Surpass", "Touch", "Train"],
  
  "Adjectives": ["Affordable", "Ancient", "Comfortable", "Compulsory", "Confident", "Convenient", "Dull", "Energetic", "Exciting", "Extinct", "Fabulous", "Fantastic", "Flexible", "Immense", "Intact", "Intensive", "Knowledgeable", "Mandatory", "Necessary", "Optimistic", "Permanent", "Pessimistic", "Practical", "Realistic", "Salty", "Social", "Spectacular", "Suitable", "Temporary", "Tranquil", "Various", "Vast", "Voluntary", "Vulnerable", "Western"],
  
  "Hobbies": ["Archery", "Billiards", "Bowls", "Caving", "Chess", "Climbing", "Darts", "Embroidery", "Gardening", "Golf", "Ice Skating", "Orienteering", "Painting", "Photography", "Pottery", "Scuba-Diving", "Skateboarding", "Snorkeling", "Spelunking", "Stamp Collection", "Woodcarving"],
  
  "Sports": ["Abseiling", "American Football", "Athlete", "Badminton", "Barbell", "Baseball", "Basketball", "Bodyboarding", "Bungee Jumping", "Canoeing", "Championship", "Court", "Cricket", "Cycling", "Extreme Sports", "Field", "Gym", "Gymnasium", "Hang-Gliding", "Hockey", "Horse Racing", "Jet-Skiing", "Jogging", "Judo", "Kitesurfing", "Mountain Biking", "Paragliding", "Ping-Pong", "Pitch", "Polo", "Press-Up", "Push-Up", "Recreation", "Refreshment", "Rugby", "Show Jumping", "Skydiving", "Snooker", "Snowboarding", "Soccer", "Squash", "Stadium", "Surfing", "Swimming", "Team", "Tennis", "The Discus", "The Hammer", "The High Jump", "The Javelin", "Treadmill", "Walking", "White-Water Rafting", "Windsurfing"],
  
  "Shapes": ["Circular", "Curved", "Cylindrical", "Oval", "Polygon", "Rectangular", "Spherical", "Spiral", "Square", "Triangular"],
  
  "Measurement": ["Altitude", "Breadth", "Depth", "Frequency", "Height", "Imperial System", "Length", "Mass", "Metric System", "Three Dimensions", "Width"],
  
  "Transportations": ["Airship", "Aircraft", "Airport", "Automobile", "Boat", "Cabin Cruiser", "Canal Boat", "Canoe", "Cargo Plane", "Container Ship", "Crew", "Dinghy Sailing", "Ferry", "Gondola", "Helicopter", "Hire A Car", "Hot-Air Balloon", "Hovercraft", "Hydrofoil", "Kayak", "Lifeboat", "Liner", "Narrowboat", "Paddle Steamer", "Passenger", "Platform", "Punt", "Rowboat", "Rowing Boat", "Sailboat", "Seaplane", "Shipment"],
  
  "Vehicles": ["Breakdown Truck", "Cab", "Camper", "Caravan", "Coach", "Double-Decker Bus", "Forklift Truck", "Freight Train", "Goods Train", "Jeep", "Lorry", "Minibus", "Pickup", "School Bus", "Single-Decker", "Stream Train", "Subway", "Tanker", "Taxi", "Tow Truck", "Tractor", "Tram", "Transporter", "Truck", "Underground", "Van"],
  
  "Weather": ["Antenna", "Breeze", "Chilly", "Cold", "Cool", "Dry", "Dusty", "Freezing", "Hot", "Humid", "Moisture", "Sticky", "Warm", "Weather Forecast", "Wet"],
  
  "Places": ["Accommodation", "Bookshop", "Cafe", "Cafeteria", "Canteen", "City Council", "Conversation Club", "Cottage", "Dance Studio", "Kindergarten", "Local Library", "Park", "Parliament", "Restaurant", "Sports Centre", "Swimming Pool"],
  
  "Equipment And Tools": ["Backpack", "Breaks", "Cassette", "Device", "Digital Monitor", "Disk", "Gadget", "Helmet", "Light", "Mechanical Pencil", "Musical Instrument", "Screen", "Silicon Chip", "Wheels"],
  
  "The Arts and Media": ["Art Gallery", "Audience", "Ballet", "Carnival", "Cinemas", "Classical Music", "Concert", "Conductor", "Exhibition", "Festival", "Graphics", "Museum", "Newspaper", "Opera", "Orchestra", "Radio", "Symphony", "Television", "The Press", "Theatre", "Vocalist"],
  
  "Materials": ["Aluminum", "Bone", "Cement", "Ceramics", "Composite", "Concrete", "Copper", "Cotton", "Fabric", "Feather", "Fiberglass", "Fur", "Glass", "Glue", "Gold", "Leather", "Lumber/Wood", "Metal", "Paper", "Plastic", "Rubber", "Silver", "Steel", "Stone", "Textile", "Wax", "Wood", "Wool"],
  
  "Works And Jobs": ["Accountant", "Architect", "Captain", "Cashier", "Clerk", "Craftsman", "Curriculum Vitae", "Decorator", "Designer", "Engineer", "Flight Attendant", "Freelance", "Guard", "Lecturer", "Mail Address", "Manager", "Occupation", "Office Assistant", "Pilot", "Profession", "Professor", "Psychologist", "Receptionist", "Secretary", "Specialist", "Teacher", "Vacancy", "Volunteer", "Waiter", "Waitress", "Work Experience"],
  
  "Color":  ["Black", "Blue", "Brown", "Green", "Grey", "Orange", "Pink", "Purple", "Red", "White", "Yellow"],
  
  "Expressions and Time": ["A Gap Year", "Century", "Decade", "Fortnight", "Full-Time", "Midday", "Midnight", "Millennium", "Part-Time", "Three Times", "Three Times Per Week"],
  
  "Other": ["Activity", "Attitude", "Burger", "Carriage", "Chocolate", "Circuit", "Commerce", "Creation", "Daily Routine", "Decision", "Demonstration", "Democrats", "Dialect", "Dialogue", "Driving License", "Encyclopedia", "Entrance", "Evolution", "Farewell", "Frequently Updated", "Fund-Raising Event", "Gender", "Government", "Guarantee", "Illiteracy", "Indigenous", "Individual", "Junior", "Liberal Democracy", "Libertarian", "Life Expectancy", "Literary", "Lunar Calendar", "Magnet", "Man-Made", "Narrative", "Nature Conservation", "Opportunity", "Original Inhabitant", "Passport Photo", "Pedestrian Safety", "Personal Fulfillment", "Practice", "Private Sector", "Prize", "Procedures", "Process", "Proficiency", "Prototype", "Ramification", "Recipient", "Republicans", "Revolution", "Robot", "Satellite", "Senior", "Sewer Systems", "State", "Straight", "Strike", "Sufficient", "Traffic Jams", "Ultrasound", "Umbrella", "Variety", "Videos", "Waiting List", "Welfare"]
};

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

  const totalAvailableWords = useMemo(() => 
    Object.values(WORD_CATEGORIES).flat().length, 
    []
  );

  const progressPercent = useMemo(() => 
    words.length ?  ((currentIndex + 1) / words.length) * 100 : 0,
    [currentIndex, words. length]
  );

  useEffect(() => {
    const savedMistakes = localStorage.getItem('ielts_mistakes');
    const savedStats = localStorage.getItem('ielts_category_stats');
    const savedSpeed = localStorage.getItem('playback_speed');
    
    if (savedMistakes) {
      try {
        setMistakeWords(JSON.parse(savedMistakes));
      } catch (error) {
        console.warn('Failed to load saved mistakes:', error);
      }
    }
    
    if (savedStats) {
      try {
        setCategoryStats(JSON. parse(savedStats));
      } catch (error) {
        console.warn('Failed to load saved stats:', error);
      }
    }
    
    if (savedSpeed) {
      setPlaybackSpeed(parseFloat(savedSpeed));
    }
  }, []);

  useEffect(() => {
    localStorage. setItem('ielts_mistakes', JSON.stringify(mistakeWords));
  }, [mistakeWords]);

  useEffect(() => {
    localStorage.setItem('ielts_category_stats', JSON.stringify(categoryStats));
  }, [categoryStats]);

  useEffect(() => {
    localStorage.setItem('playback_speed', playbackSpeed.toString());
  }, [playbackSpeed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event. target as Node)) {
        setShowSpeedMenu(false);
      }
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(event.target as Node)) {
        setShowVoiceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load voices with mobile support
  useEffect(() => {
    let voicesLoaded = false;
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // On mobile, voices might be empty on first call
      if (availableVoices.length === 0 && ! voicesLoaded) {
        return; // Wait for onvoiceschanged
      }
      
      voicesLoaded = true;
      
      // Filter for UK voices
      const ukOnly = availableVoices.filter(v => v.lang === 'en-GB');
      setUkVoices(ukOnly);
      
      // Get all English voices as fallback
      const englishVoices = availableVoices.filter(v => v.lang && v.lang.startsWith('en'));
      setAllEnglishVoices(englishVoices);
      
      // Select best voice (UK preferred, any English as fallback)
      const bestVoice = 
        // Try UK voices first
        ukOnly.find(v => v.name.includes('Google') && v.name.includes('UK')) ||
        ukOnly.find(v => v. name.includes('Google')) ||
        ukOnly.find(v => v. name.includes('Microsoft') || v.name.includes('Hazel') || v.name.includes('Daniel')) ||
        ukOnly[0] ||
        // Fallback to any English voice on mobile
        englishVoices.find(v => v.name.includes('Google')) ||
        englishVoices.find(v => v.lang. startsWith('en-US')) ||
        englishVoices[0];
      
      setSelectedVoice(prev => prev || bestVoice || null);
      
      const savedVoiceName = localStorage.getItem('selected_uk_voice');
      if (savedVoiceName) {
        const savedVoice = availableVoices.find(v => v.name === savedVoiceName);
        if (savedVoice) setSelectedVoice(savedVoice);
      }
    };

    // Initial load
    loadVoices();
    
    // Mobile Chrome needs this event
    window.speechSynthesis. onvoiceschanged = loadVoices;
    
    // Force load on mobile with slight delay
    const timeoutId = setTimeout(() => {
      loadVoices();
    }, 100);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('selected_uk_voice', selectedVoice.name);
    }
  }, [selectedVoice]);

  const shuffleArray = (array: string[]): string[] => {
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
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = playbackSpeed;
        utterance. pitch = 1;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.warn('Speech synthesis error:', error);
      }
    }
  };

  const togglePause = () => {
    if (! ('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      if (! isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else {
        window.speechSynthesis. resume();
        setIsPaused(false);
      }
    } else {
      speak(words[currentIndex]);
      setIsPaused(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    speak("Speed changed");
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    setShowVoiceMenu(false);
    try {
      const utterance = new SpeechSynthesisUtterance("Voice changed");
      utterance.voice = voice;
      utterance. rate = playbackSpeed;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Voice test error:', error);
    }
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
    
    if (stats?. completed && mistakeCount > 0) {
      setPendingCategory(category);
      setShowCategoryModal(true);
    } else {
      startTest(category, 'normal');
    }
  };

  const handleModalChoice = (mode: 'mistakes' | 'full') => {
    if (pendingCategory) {
      if (mode === 'mistakes') {
        startTest(pendingCategory, 'mistakes');
      } else {
        startTest(pendingCategory, 'normal');
      }
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
      } else {
        wordList = [... mistakeWords];
        categoryName = 'All Mistakes';
      }
    } else if (category) {
      wordList = WORD_CATEGORIES[category] ?  [... WORD_CATEGORIES[category]] : [];
      categoryName = category;
    } else {
      wordList = Object.values(WORD_CATEGORIES).flat();
      categoryName = 'Mixed';
    }

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
    
    setTimeout(() => {
      speak(shuffled[0]);
    }, 400);
  };

  const updateCategoryStats = (category: string, correct: number, total: number) => {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    setCategoryStats(prev => ({
      ...prev,
      [category]: {
        answered: total,
        correct:  correct,
        mistakes: total - correct,
        percentage: percentage,
        completed: true
      }
    }));
  };

  const checkAnswer = () => {
    if (!userInput.trim()) return;

    const cleanInput = userInput.trim().toLowerCase();
    const cleanTarget = (words[currentIndex] || '').toLowerCase();
    
    const correct = cleanInput === cleanTarget;
    setIsCorrect(correct);
    setShowResult(true);
    
    const newScore = {
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    if (! correct) {
      if (! mistakeWords.includes(words[currentIndex])) {
        setMistakeWords(prev => [...prev, words[currentIndex]]);
      }
      speak(`Incorrect. The correct spelling is ${words[currentIndex]}`);
    } else {
      if (mistakeWords.includes(words[currentIndex])) {
        setMistakeWords(prev => prev. filter(w => w !== words[currentIndex]));
      }
      speak('Correct');
      
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setUserInput('');
          setShowResult(false);
          setIsCorrect(false);
          
          setTimeout(() => {
            inputRef.current?.focus();
            speak(words[nextIdx]);
          }, 100);
        } else {
          const originalCategory = selectedCategory?. replace(' - Mistakes', '').replace('All Mistakes', '');
          
          if (originalCategory && originalCategory !== 'Mixed' && WORD_CATEGORIES[originalCategory]) {
            if (selectedCategory?. includes('Mistakes')) {
              const existing = categoryStats[originalCategory];
              if (existing) {
                const updatedCorrect = existing.correct + newScore.correct;
                const updatedTotal = existing.answered + newScore.total;
                updateCategoryStats(originalCategory, updatedCorrect, updatedTotal);
              }
            } else {
              updateCategoryStats(originalCategory, newScore.correct, newScore.total);
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
      
      setTimeout(() => {
        inputRef.current?.focus();
        speak(words[nextIdx]);
      }, 300);
    } else {
      const originalCategory = selectedCategory?.replace(' - Mistakes', '').replace('All Mistakes', '');
      
      if (originalCategory && originalCategory !== 'Mixed' && WORD_CATEGORIES[originalCategory]) {
        if (selectedCategory?.includes('Mistakes')) {
          const existing = categoryStats[originalCategory];
          if (existing) {
            const updatedCorrect = existing.correct + score.correct;
            const updatedTotal = existing.answered + score. total;
            updateCategoryStats(originalCategory, updatedCorrect, updatedTotal);
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

  const clearMistakes = () => {
    if (window.confirm('Are you sure you want to clear your saved mistake words?')) {
      setMistakeWords([]);
    }
  };

  const goHome = () => {
    setIsPlaying(false);
    setShowResults(false);
    window.speechSynthesis.cancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e. key === 'Enter' && isPlaying && !isPaused) {
      if (showResult) {
        if (! isCorrect) {
          nextWord();
        }
      } else {
        checkAnswer();
      }
    }
  };

  const getCategoryMistakeCount = (category: string): number => {
    const categoryWords = WORD_CATEGORIES[category] || [];
    return mistakeWords.filter(word => categoryWords.includes(word)).length;
  };

  const FloatingControls = () => (
    <div className="flex items-center gap-2">
      <div className="relative" ref={speedMenuRef}>
        <button
          onClick={() => {
            setShowSpeedMenu(! showSpeedMenu);
            setShowVoiceMenu(false);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          title="Playback Speed"
        >
          <Gauge size={18} />
          <span className="text-sm font-medium">{playbackSpeed}x</span>
          <ChevronDown size={16} />
        </button>
        
        {showSpeedMenu && (
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border-2 border-purple-200 py-2 z-50 min-w-[140px]">
            {SPEED_OPTIONS.map(option => (
              <button
                key={option. value}
                onClick={() => handleSpeedChange(option.value)}
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors flex items-center justify-between ${
                  playbackSpeed === option.value ?  'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {playbackSpeed === option.value && (
                  <CheckCircle size={16} className="text-purple-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {allEnglishVoices.length > 0 && (
        <div className="relative" ref={voiceMenuRef}>
          <button
            onClick={() => {
              setShowVoiceMenu(!showVoiceMenu);
              setShowSpeedMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            title="Change Voice"
          >
            <Volume2 size={18} />
            <span className="text-sm font-medium hidden sm:inline">Voice</span>
            <ChevronDown size={16} />
          </button>
          
          {showVoiceMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border-2 border-indigo-200 py-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 mb-1">
                {ukVoices.length > 0 ? `UK Voices (${ukVoices. length})` : `English Voices (${allEnglishVoices.length})`}
              </div>
              {(ukVoices.length > 0 ?  ukVoices : allEnglishVoices).map(voice => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceChange(voice)}
                  className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors text-sm ${
                    selectedVoice?. name === voice.name ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{voice.name. split(' ')[0]}</span>
                    {selectedVoice?.name === voice.name && (
                      <CheckCircle size={14} className="text-indigo-600 flex-shrink-0 ml-2" />
                    )}
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
          <div className="text-sm opacity-90">
            {completedCategories}/{totalCategories} Categories
          </div>
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
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500" 
              style={{ width: `${totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const CategoryModal = () => {
    if (!showCategoryModal || !pendingCategory) return null;
    
    const stats = categoryStats[pendingCategory];
    const mistakeCount = getCategoryMistakeCount(pendingCategory);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{pendingCategory}</h3>
            <button
              onClick={() => {
                setShowCategoryModal(false);
                setPendingCategory(null);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">Last Score</div>
              <div className="text-3xl font-bold text-green-600">
                {stats?. percentage}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stats?.correct}/{stats?.answered} correct
              </div>
            </div>
            
            {mistakeCount > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-600 font-medium">
                  You have {mistakeCount} mistake{mistakeCount > 1 ? 's' : ''} to review
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => handleModalChoice('mistakes')}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={24} />
              Review {mistakeCount} Mistake{mistakeCount > 1 ? 's' : ''}
            </button>
            
            <button
              onClick={() => handleModalChoice('full')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
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
        <button
          onClick={() => startTest(null, 'normal')}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left flex flex-col justify-between h-32"
        >
          <span className="text-2xl font-bold"><Play className="inline mr-2"/> All Categories</span>
          <span className="opacity-80 text-sm">Mix of {totalAvailableWords} words</span>
        </button>

        {mistakeWords.length > 0 && (
          <button
            onClick={() => startTest(null, 'mistakes')}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover: scale-105 transition-all text-left flex flex-col justify-between h-32"
          >
            <span className="text-2xl font-bold"><AlertCircle className="inline mr-2"/> Review Mistakes</span>
            <span className="opacity-80 text-sm">{mistakeWords.length} words to fix</span>
          </button>
        )}

        {Object.keys(WORD_CATEGORIES).map((cat) => {
          const stats = categoryStats[cat];
          const mistakeCount = getCategoryMistakeCount(cat);
          const isCompleted = stats?.completed;
          
          return (
            <div key={cat} className="relative">
              <button
                onClick={() => handleCategoryClick(cat)}
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
                    {cat}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="text-green-600" size={24} />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 text-sm">{WORD_CATEGORIES[cat]. length} words</span>
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
    </>
  );

  const renderResultsScreen = () => {
    const finalCorrect = score. correct;
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
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              {percentage}%
            </div>
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
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={goHome}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Home size={24} />
            Back to Home
          </button>
          <button
            onClick={() => {
              const cleanCategory = selectedCategory?. replace(' - Mistakes', '').replace('All Mistakes', '');
              startTest(cleanCategory || null, 'normal');
            }}
            className="flex-1 bg-white border-2 border-purple-500 text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            IELTS Spelling Master
          </h1>
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
                <p className="text-sm text-gray-600 mb-2">
                  <strong>✅ Currently using:</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Voice: </span>
                    <span className="font-medium text-purple-600">
                      {selectedVoice?. name || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium text-purple-600">{playbackSpeed}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {ukVoices.length > 0 ? 'UK Voices: ' : 'English Voices:'}
                    </span>
                    <span className="font-medium text-green-600">
                      {ukVoices.length > 0 ? ukVoices.length : allEnglishVoices.length}
                    </span>
                  </div>
                </div>
                
                {ukVoices.length === 0 && allEnglishVoices.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 mb-1">
                      ℹ️ No UK voices available
                    </p>
                    <p className="text-xs text-gray-600">
                      ✅ Using {allEnglishVoices. length} English voice{allEnglishVoices.length > 1 ? 's' : ''} as fallback
                    </p>
                  </div>
                )}
                
                {allEnglishVoices. length === 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 mb-2">
                      ⚠️ No voices detected
                    </p>
                    <button
                      onClick={forceLoadVoices}
                      className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                      🔄 Load Voices
                    </button>
                  </div>
                )}
              </div>

              {mistakeWords.length > 0 && (
                <div className="mt-4 text-center">
                  <button onClick={clearMistakes} className="text-xs text-red-500 hover:text-red-700 underline">
                    Clear Mistake History
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-10">
            {showResults ?  (
              renderResultsScreen()
            ) : !isPlaying ?  (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="text-purple-500"/> Select a Category to Practice
                </h2>
                {renderCategoryGrid()}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2. 5 mb-6">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mb-8 text-sm">
                   <span className="text-gray-600">
                     Category: <strong className="text-purple-600">{selectedCategory}</strong>
                   </span>
                   <div className="flex items-center gap-3">
                     <FloatingControls />
                     <span className="text-gray-600">
                       Progress: <strong className="text-purple-600">{currentIndex + 1}/{words.length}</strong>
                     </span>
                   </div>
                </div>

                <div className="text-center mb-8">
                  <button
                    onClick={() => { window.speechSynthesis.cancel(); speak(words[currentIndex]); setIsPaused(false); }}
                    className="group relative inline-flex items-center justify-center p-4 px-8 py-4 overflow-hidden font-medium text-purple-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group hover:bg-purple-50"
                    aria-label="Replay audio"
                  >
                    <Volume2 size={32} className={`mr-2 ${isPaused ? 'opacity-50' : 'animate-pulse'}`} />
                    <span className="text-lg">Replay Audio</span>
                  </button>
                </div>

                <div className="relative mb-6">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={showResult || isPaused}
                    className={`w-full text-center text-3xl font-bold py-4 border-b-4 focus:outline-none bg-transparent transition-colors ${
                      showResult 
                        ? isCorrect ?  'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                        : 'border-gray-300 focus:border-purple-500 text-gray-800'
                    }`}
                    placeholder="Type here..."
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Type your answer"
                  />
                </div>

                <div className="h-24 mb-6 text-center">
                  {showResult && (
                    <div className={`transform transition-all duration-300 ${isCorrect ? 'scale-100' : 'shake'}`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle size={28} />
                          <span className="text-2xl font-bold">Correct! </span>
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <XCircle size={28} />
                            <span className="text-2xl font-bold">Incorrect</span>
                          </div>
                          <p className="text-gray-600">
                            Correct spelling: <span className="font-mono font-bold text-red-600 text-xl tracking-wide">{words[currentIndex]}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  {!showResult ?  (
                    <>
                      <button
                        onClick={checkAnswer}
                        disable
