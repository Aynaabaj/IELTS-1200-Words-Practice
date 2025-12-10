import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, Play, Pause, SkipForward, CheckCircle, XCircle, AlertCircle, Settings, BookOpen } from 'lucide-react';
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
  
  "Countries":  ["Brazil", "China", "Denmark", "Egypt", "England", "France", "Germany", "Greece", "India", "Indonesia", "Italy", "Malaysia", "Mexico", "New Zealand", "Nigeria", "North Korea", "Pakistan", "Singapore", "Switzerland", "The Dominican Republic", "The Philippines", "Turkey", "United Kingdom"],
  
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
  
  "Color": ["Black", "Blue", "Brown", "Green", "Grey", "Orange", "Pink", "Purple", "Red", "White", "Yellow"],
  
  "Expressions and Time": ["A Gap Year", "Century", "Decade", "Fortnight", "Full-Time", "Midday", "Midnight", "Millennium", "Part-Time", "Three Times", "Three Times Per Week"],
  
  "Other": ["Activity", "Attitude", "Burger", "Carriage", "Chocolate", "Circuit", "Commerce", "Creation", "Daily Routine", "Decision", "Demonstration", "Democrats", "Dialect", "Dialogue", "Driving License", "Encyclopedia", "Entrance", "Evolution", "Farewell", "Frequently Updated", "Fund-Raising Event", "Gender", "Government", "Guarantee", "Illiteracy", "Indigenous", "Individual", "Junior", "Liberal Democracy", "Libertarian", "Life Expectancy", "Literary", "Lunar Calendar", "Magnet", "Man-Made", "Narrative", "Nature Conservation", "Opportunity", "Original Inhabitant", "Passport Photo", "Pedestrian Safety", "Personal Fulfillment", "Practice", "Private Sector", "Prize", "Procedures", "Process", "Proficiency", "Prototype", "Ramification", "Recipient", "Republicans", "Revolution", "Robot", "Satellite", "Senior", "Sewer Systems", "State", "Straight", "Strike", "Sufficient", "Traffic Jams", "Ultrasound", "Umbrella", "Variety", "Videos", "Waiting List", "Welfare"]
};

const IELTSListeningPractice:  React.FC = () => {
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const totalAvailableWords = useMemo(() => 
    Object.values(WORD_CATEGORIES).flat().length, 
    []
  );

  const progressPercent = useMemo(() => 
    words.length ?  ((currentIndex + 1) / words.length) * 100 : 0,
    [currentIndex, words.length]
  );

  useEffect(() => {
    const savedMistakes = localStorage.getItem('ielts_mistakes');
    if (savedMistakes) {
      try {
        setMistakeWords(JSON.parse(savedMistakes));
      } catch (error) {
        console.warn('Failed to load saved mistakes:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ielts_mistakes', JSON.stringify(mistakeWords));
  }, [mistakeWords]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      const defaultVoice = availableVoices.find(v => 
        (v.name. includes("Google") || v.name.includes("Microsoft")) && v.lang. includes("en")
      ) || availableVoices. find(v => v.lang. includes("en"));
      
      setSelectedVoice(prev => prev || defaultVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        window. speechSynthesis.speak(utterance);
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

  const startTest = (category: string | null = null, mode: 'normal' | 'mistakes' = 'normal') => {
    let wordList: string[] = [];
    let categoryName = '';

    if (mode === 'mistakes') {
      wordList = [... mistakeWords];
      categoryName = 'Mistakes Review';
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
    
    setTimeout(() => {
      speak(shuffled[0]);
    }, 400);
  };

  const checkAnswer = () => {
    if (!userInput.trim()) return;

    const cleanInput = userInput.trim().toLowerCase();
    const cleanTarget = (words[currentIndex] || '').toLowerCase();
    
    const correct = cleanInput === cleanTarget;
    setIsCorrect(correct);
    setShowResult(true);
    
    setScore(prev => ({
      correct: prev.correct + (correct ?  1 : 0),
      total: prev.total + 1
    }));

    if (! correct) {
      if (! mistakeWords.includes(words[currentIndex])) {
        setMistakeWords(prev => [...prev, words[currentIndex]]);
      }
      speak(`Incorrect. The correct spelling is ${words[currentIndex]}`);
    } else {
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
          setIsPlaying(false);
          speak(`Test completed! You got ${score.correct + 1} out of ${words.length}`);
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
      const finalCorrect = score.correct + (showResult && isCorrect ? 1 :  0);
      setIsPlaying(false);
      speak(`Test completed! You got ${finalCorrect} out of ${words.length}`);
    }
  };

  const clearMistakes = () => {
    if (window.confirm('Are you sure you want to clear your saved mistake words?')) {
      setMistakeWords([]);
    }
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

  const handleVoiceChange = (e: React. ChangeEvent<HTMLSelectElement>) => {
    const voiceId = e.target.value;
    const voice = voices.find(v => `${v.name}__${v.lang}` === voiceId);
    
    if (voice) {
      setSelectedVoice(voice);
      try {
        const utterance = new SpeechSynthesisUtterance("Voice selected");
        utterance.voice = voice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.warn('Voice test error:', error);
      }
    } else {
      setSelectedVoice(null);
    }
  };

  const renderCategoryGrid = () => (
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
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left flex flex-col justify-between h-32"
        >
          <span className="text-2xl font-bold"><AlertCircle className="inline mr-2"/> Review Mistakes</span>
          <span className="opacity-80 text-sm">{mistakeWords.length} words to fix</span>
        </button>
      )}

      {Object.keys(WORD_CATEGORIES).map((cat) => (
        <button
          key={cat}
          onClick={() => startTest(cat, 'normal')}
          className="bg-white border-2 border-purple-100 p-6 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col justify-between h-32 group"
        >
          <span className="text-lg font-semibold text-gray-700 group-hover:text-purple-600">{cat}</span>
          <span className="text-gray-400 text-sm">{WORD_CATEGORIES[cat]. length} words</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            IELTS Spelling Master
          </h1>
          <p className="text-gray-500">Sharpen your listening skills for the exam</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {! isPlaying && (
            <div className="bg-purple-50 p-4 border-b border-purple-100 flex flex-wrap gap-4 items-center justify-between">
               <div className="flex items-center gap-2 text-purple-800 font-medium">
                  <Settings size={20} />
                  <span>Settings</span>
               </div>
               <div className="flex items-center gap-2">
                 <label className="text-sm text-gray-600">Voice:  </label>
                 <select 
                    className="p-2 rounded border border-gray-300 text-sm min-w-[200px]"
                    onChange={handleVoiceChange}
                    value={selectedVoice ?  `${selectedVoice.name}__${selectedVoice.lang}` : ''}
                 >
                   <option value="">Default Browser Voice</option>
                   {voices.filter(v => v.lang && v.lang.includes('en')).map(v => (
                     <option key={`${v.name}__${v.lang}`} value={`${v.name}__${v. lang}`}>
                       {v.name} ({v.lang})
                     </option>
                   ))}
                 </select>
               </div>
               {mistakeWords.length > 0 && (
                 <button onClick={clearMistakes} className="text-xs text-red-500 hover:text-red-700 underline">
                   Clear History
                 </button>
               )}
            </div>
          )}

          <div className="p-6 md:p-10">
            {! isPlaying ? (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="text-purple-500"/> Select a Category to Practice
                </h2>
                {renderCategoryGrid()}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width:  `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mb-8 text-sm text-gray-500">
                   <span>Category: <strong className="text-purple-600">{selectedCategory}</strong></span>
                   <span>Progress: <strong>{currentIndex + 1}/{words.length}</strong></span>
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
                        ? isCorrect ?  'border-green-500 text-green-700' :  'border-red-500 text-red-700'
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
                          <span className="text-2xl font-bold">Correct!  </span>
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
                  {! showResult ?  (
                    <>
                      <button
                        onClick={checkAnswer}
                        disabled={! userInput.trim()}
                        className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all transform hover:-translate-y-1"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={togglePause}
                        className="px-6 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        aria-label={isPaused ?  'Resume audio' : 'Pause audio'}
                      >
                        {isPaused ? <Play /> : <Pause />}
                      </button>
                    </>
                  ) : (
                    <>
                      {! isCorrect && (
                        <button
                          onClick={nextWord}
                          autoFocus
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2"
                        >
                          Next Word <SkipForward size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mt-8 text-center">
                   <button 
                     onClick={() => { 
                       window.speechSynthesis.cancel(); 
                       setIsPlaying(false); 
                     }} 
                     className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
                   >
                     Exit Test
                   </button>
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
