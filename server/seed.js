const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // fallback if system restricts custom dns
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const Notification = require('./models/Notification');
const MedicalRecord = require('./models/MedicalRecord');

const DOCTORS_DATA = [
  // ===================== 1. CARDIOLOGY (5 Doctors) =====================
  {
    name: 'Rajesh Sharma',
    email: 'doctor@example.com', // Primary demo login
    phone: '+91 98111 22334',
    gender: 'male',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD General Medicine', 'DM Cardiology (AIIMS)', 'FACC'],
    experience: 16,
    consultationFee: 1200,
    about: 'Senior Consultant Interventional Cardiologist with over 16 years of experience in coronary interventions, cardiac rhythm disorders, and hypertension management.',
    hospital: 'Apollo Hospitals, Greams Road, Chennai',
    languages: ['English', 'Tamil', 'Hindi'],
    rating: 4.9,
    totalReviews: 48,
    reviews: [
      { rating: 5, comment: 'Dr. Rajesh Sharma is exceptionally calm and reassuring. Thoroughly explained my ECG and echo reports.' },
      { rating: 5, comment: 'Very professional clinic environment. Minimal waiting time and compassionate bedside manner.' },
    ],
  },
  {
    name: 'Devendra Saxena',
    email: 'devendra.saxena@example.com',
    phone: '+91 98111 22335',
    gender: 'male',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD', 'DM Cardiology', 'FESC'],
    experience: 20,
    consultationFee: 1500,
    about: 'Renowned clinical cardiologist specializing in complex coronary angioplasty, heart failure therapeutics, and structural heart interventions.',
    hospital: 'Fortis Escorts Heart Institute, Okhla, New Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.9,
    totalReviews: 52,
    reviews: [
      { rating: 5, comment: 'One of the best heart specialists in North India. Highly accurate diagnosis and treatment.' },
    ],
  },
  {
    name: 'Shalini Mukherjee',
    email: 'shalini.mukherjee@example.com',
    phone: '+91 98111 22336',
    gender: 'female',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD Medicine', 'DM Cardiology', 'Fellowship in Cardiac Electrophysiology'],
    experience: 13,
    consultationFee: 1100,
    about: 'Expert electrophysiologist and cardiologist specializing in cardiac pacing, arrhythmia management, CRT-D implantation, and women heart health.',
    hospital: 'Narayana Health City, Bommasandra, Bengaluru',
    languages: ['English', 'Bengali', 'Kannada', 'Hindi'],
    rating: 4.8,
    totalReviews: 39,
  },
  {
    name: 'K. M. Cherian',
    email: 'cherian.cardio@example.com',
    phone: '+91 98111 22337',
    gender: 'male',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MS', 'MCh Cardio Thoracic', 'FRACS (Aus)'],
    experience: 24,
    consultationFee: 1400,
    about: 'Eminent cardiac physician and consultant specializing in pediatric and adult preventative cardiac evaluations and valvular heart therapies.',
    hospital: 'Frontier Lifeline Hospital, Mogappair, Chennai',
    languages: ['English', 'Malayalam', 'Tamil'],
    rating: 5.0,
    totalReviews: 65,
  },
  {
    name: 'Anand Somani',
    email: 'anand.somani@example.com',
    phone: '+91 98111 22338',
    gender: 'male',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD Cardiology', 'DNB Cardiology'],
    experience: 12,
    consultationFee: 1300,
    about: 'Specialist in non-invasive cardiac imaging, transesophageal echocardiography, stress echo, and dyslipidemia risk prevention.',
    hospital: 'Asian Heart Institute, Bandra Kurla Complex, Mumbai',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    rating: 4.8,
    totalReviews: 31,
  },

  // ===================== 2. DERMATOLOGY (5 Doctors) =====================
  {
    name: 'Ananya Iyer',
    email: 'ananya@example.com',
    phone: '+91 98222 33445',
    gender: 'female',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'MD Dermatology & Venereology (CMC Vellore)'],
    experience: 10,
    consultationFee: 800,
    about: 'Specialist in clinical dermatology, adult and pediatric eczema, psoriasis, acne management, and modern aesthetic laser treatments.',
    hospital: 'Manipal Hospital, Old Airport Road, Bengaluru',
    languages: ['English', 'Kannada', 'Tamil', 'Hindi'],
    rating: 4.8,
    totalReviews: 36,
    reviews: [
      { rating: 5, comment: 'Prescribed an effective skincare routine for my persistent dermatitis. Noticed visible recovery within 10 days.' },
    ],
  },
  {
    name: 'Rohit Batra',
    email: 'rohit.batra@example.com',
    phone: '+91 98222 33446',
    gender: 'male',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'MD Dermatology', 'Fellow in Dermato-Surgery'],
    experience: 15,
    consultationFee: 900,
    about: 'Senior dermatologist and laser specialist focused on vitiligo surgeries, scar revision, hair loss trichology, and pigmentary disorders.',
    hospital: 'Sir Ganga Ram Hospital, Rajinder Nagar, New Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.9,
    totalReviews: 44,
  },
  {
    name: 'Meera Krishnan',
    email: 'meera.krishnan@example.com',
    phone: '+91 98222 33447',
    gender: 'female',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'DDVL', 'MD Dermatology (Madras Medical College)'],
    experience: 11,
    consultationFee: 750,
    about: 'Consultant dermatologist addressing chronic urticaria, fungal skin infections, hair fall therapy, and pediatric atopic dermatitis.',
    hospital: "Dr. Mehta's Multispecialty Hospital, Chetpet, Chennai",
    languages: ['English', 'Tamil'],
    rating: 4.7,
    totalReviews: 28,
  },
  {
    name: 'Apratim Goel',
    email: 'apratim.goel@example.com',
    phone: '+91 98222 33448',
    gender: 'female',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'DNB Dermatology', 'FAGE'],
    experience: 14,
    consultationFee: 1000,
    about: 'Leading cosmetic dermatologist providing advanced acne scar subcision, anti-aging therapies, and personalized skincare regimens.',
    hospital: 'Cutis Dermatology & Aesthetic Centre, Bandra West, Mumbai',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.9,
    totalReviews: 53,
  },
  {
    name: 'Varun Koul',
    email: 'varun.koul@example.com',
    phone: '+91 98222 33449',
    gender: 'male',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'MD Skin & VD', 'IADVL Fellow'],
    experience: 9,
    consultationFee: 850,
    about: 'Clinical dermatologist specializing in autoimmune skin blistering diseases, psoriasis biologics, and pediatric dermatology.',
    hospital: 'Max Super Speciality Hospital, Sector 43, Gurugram',
    languages: ['English', 'Hindi', 'Kashmiri'],
    rating: 4.8,
    totalReviews: 22,
  },

  // ===================== 3. PEDIATRICS (5 Doctors) =====================
  {
    name: 'Priya Nair',
    email: 'priya@example.com',
    phone: '+91 98333 44556',
    gender: 'female',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'DCH', 'MD Pediatrics (JIPMER)', 'IAP Fellow'],
    experience: 12,
    consultationFee: 700,
    about: 'Compassionate pediatrician focusing on newborn care, childhood vaccinations, growth and developmental milestones, and pediatric asthma.',
    hospital: 'Cloudnine Hospital, T. Nagar, Chennai',
    languages: ['English', 'Malayalam', 'Tamil'],
    rating: 5.0,
    totalReviews: 42,
    reviews: [
      { rating: 5, comment: 'Dr. Priya handles children with immense patience. My daughter was not scared at all during her vaccination visit.' },
    ],
  },
  {
    name: 'H. P. S. Sachdev',
    email: 'sachdev.pediatrics@example.com',
    phone: '+91 98333 44557',
    gender: 'male',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'MD Pediatrics', 'FAMS', 'FIAP'],
    experience: 25,
    consultationFee: 900,
    about: 'Senior pediatric consultant with extensive expertise in infant nutrition, childhood gastrointestinal illnesses, and recurrent respiratory infections.',
    hospital: 'Sitaram Bhartia Institute of Science and Research, New Delhi',
    languages: ['English', 'Hindi'],
    rating: 4.9,
    totalReviews: 61,
  },
  {
    name: 'Santosh Soans',
    email: 'santosh.soans@example.com',
    phone: '+91 98333 44558',
    gender: 'male',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'MD Pediatrics', 'FRCPCH (UK)'],
    experience: 18,
    consultationFee: 650,
    about: 'Specialist in pediatric critical care, newborn developmental screening, and infectious disease therapies in children.',
    hospital: 'KMC Hospital, Mangaluru / Manipal Hospital Bengaluru',
    languages: ['English', 'Kannada', 'Tulu', 'Hindi'],
    rating: 4.8,
    totalReviews: 34,
  },
  {
    name: 'Deepa Hariharan',
    email: 'deepa.hariharan@example.com',
    phone: '+91 98333 44559',
    gender: 'female',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'DCH', 'MRCPCH (UK)', 'Fellow in Neonatology'],
    experience: 16,
    consultationFee: 850,
    about: 'Senior neonatologist and pediatrician providing specialized care for premature infants, neonatal jaundice, and childhood allergy management.',
    hospital: "Apollo Children's Hospital, Thousand Lights, Chennai",
    languages: ['English', 'Tamil', 'Telugu'],
    rating: 4.9,
    totalReviews: 47,
  },
  {
    name: 'Arvind Shenoi',
    email: 'arvind.shenoi@example.com',
    phone: '+91 98333 44560',
    gender: 'male',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'MD Pediatrics', 'DNB', 'Fellow Neonatology'],
    experience: 15,
    consultationFee: 750,
    about: 'Leading pediatric specialist focusing on early childhood development, behavioral issues, nutrition plans, and immunization schedules.',
    hospital: "Rainbow Children's Hospital, Marathahalli, Bengaluru",
    languages: ['English', 'Kannada', 'Hindi'],
    rating: 4.8,
    totalReviews: 29,
  },

  // ===================== 4. NEUROLOGY (5 Doctors) =====================
  {
    name: 'Arvind Swaminathan',
    email: 'arvind@example.com',
    phone: '+91 98444 55667',
    gender: 'male',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'MD Medicine', 'DM Neurology (NIMHANS)'],
    experience: 15,
    consultationFee: 1500,
    about: 'Senior Neurologist specializing in stroke management, chronic migraine, peripheral neuropathies, Parkinson’s disease, and epilepsy management.',
    hospital: 'Fortis Malar Hospital, Adyar, Chennai',
    languages: ['English', 'Tamil'],
    rating: 4.9,
    totalReviews: 29,
  },
  {
    name: 'Manjari Tripathi',
    email: 'manjari.tripathi@example.com',
    phone: '+91 98444 55668',
    gender: 'female',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'MD Medicine', 'DM Neurology (AIIMS)', 'FAMS'],
    experience: 22,
    consultationFee: 1400,
    about: 'Head of Neurology unit specializing in refractory epilepsy, sleep medicine, cognitive disorders, dementia, and neuro-electrophysiology.',
    hospital: 'AIIMS Neurosciences Centre, Ansari Nagar, New Delhi',
    languages: ['English', 'Hindi'],
    rating: 5.0,
    totalReviews: 58,
  },
  {
    name: 'Prithika Chary',
    email: 'prithika.chary@example.com',
    phone: '+91 98444 55669',
    gender: 'female',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'MD', 'DM Neurology', 'MNAMS', 'PhD'],
    experience: 26,
    consultationFee: 1300,
    about: 'First lady neuro-physician in India, pioneering stroke recovery, neuro-rehabilitation, multiple sclerosis, and comprehensive epilepsy clinics.',
    hospital: 'Kauvery Hospital, Alwarpet, Chennai',
    languages: ['English', 'Tamil'],
    rating: 4.9,
    totalReviews: 73,
  },
  {
    name: 'K. S. Anand',
    email: 'ks.anand@example.com',
    phone: '+91 98444 55670',
    gender: 'male',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'MD', 'DM Neurology (PGI Chandigarh)'],
    experience: 19,
    consultationFee: 1200,
    about: 'Renowned expert in Alzheimer’s disease, vertigo, neuropathic pain management, stroke prevention, and neuromuscular disorders.',
    hospital: 'Max Super Speciality Hospital, Saket, New Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.8,
    totalReviews: 41,
  },
  {
    name: 'Murali Krishna',
    email: 'murali.krishna@example.com',
    phone: '+91 98444 55671',
    gender: 'male',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'MD', 'DM Neurology', 'Fellow in Movement Disorders'],
    experience: 14,
    consultationFee: 1350,
    about: 'Neurologist experienced in movement disorders, Deep Brain Stimulation (DBS) management, tremors, and neuro-immunology.',
    hospital: 'Aster CMI Hospital, Hebbal, Bengaluru',
    languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
    rating: 4.8,
    totalReviews: 33,
  },

  // ===================== 5. ORTHOPEDICS (5 Doctors) =====================
  {
    name: 'Meenakshi Sundaram',
    email: 'meenakshi@example.com',
    phone: '+91 98555 66778',
    gender: 'male',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS Ortho', 'MCh Orth (UK)', 'Fellow in Joint Replacement'],
    experience: 18,
    consultationFee: 1000,
    about: 'Renowned orthopedic surgeon specializing in robotic total knee & hip replacement, sports ligament reconstructions, and arthritis rehabilitation.',
    hospital: 'MIOT International Hospital, Manapakkam, Chennai',
    languages: ['English', 'Tamil', 'Telugu'],
    rating: 4.8,
    totalReviews: 55,
  },
  {
    name: 'Ashok Rajgopal',
    email: 'ashok.rajgopal@example.com',
    phone: '+91 98555 66779',
    gender: 'male',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS Ortho', 'MCh Orth (Liverpool)', 'FRCS'],
    experience: 28,
    consultationFee: 1500,
    about: 'Padma Shri awardee, having performed over 30,000 knee surgeries. Pioneer in minimally invasive robotic joint replacements.',
    hospital: 'Medanta The Medicity, Sector 38, Gurugram',
    languages: ['English', 'Hindi'],
    rating: 5.0,
    totalReviews: 89,
  },
  {
    name: 'S. K. S. Marya',
    email: 'sks.marya@example.com',
    phone: '+91 98555 66780',
    gender: 'male',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS Ortho', 'MCh Orth (UK)', 'DNB Ortho'],
    experience: 24,
    consultationFee: 1400,
    about: 'Chairman of Bone and Joint Institute, world-renowned for bilateral knee replacement, complex revision hip surgeries, and trauma reconstruction.',
    hospital: 'Max Healthcare Institute, Saket, New Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.9,
    totalReviews: 67,
  },
  {
    name: 'C. Rex',
    email: 'rex.ortho@example.com',
    phone: '+91 98555 66781',
    gender: 'male',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS Ortho', 'MCh Orth (UK)', 'FRCS (Edin)'],
    experience: 21,
    consultationFee: 900,
    about: 'Specialist in arthroscopic shoulder surgery, ACL/PCL reconstructions, cervical spine treatments, and keyhole joint interventions.',
    hospital: 'Rex Ortho & Trauma Hospital, Coimbatore / Chennai',
    languages: ['English', 'Tamil', 'Malayalam'],
    rating: 4.8,
    totalReviews: 46,
  },
  {
    name: 'Sanjay Agarwala',
    email: 'sanjay.agarwala@example.com',
    phone: '+91 98555 66782',
    gender: 'male',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS Ortho', 'MCh Orth (Liverpool)'],
    experience: 23,
    consultationFee: 1250,
    about: 'Chief of Surgery and Orthopedics, pioneer in non-operative medical management of Avascular Necrosis (AVN) and complicated joint replacements.',
    hospital: 'P. D. Hinduja National Hospital, Mahim, Mumbai',
    languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
    rating: 4.9,
    totalReviews: 58,
  },

  // ===================== 6. GENERAL PHYSICIAN (5 Doctors) =====================
  {
    name: 'Vikram Patel',
    email: 'vikram@example.com',
    phone: '+91 98666 77889',
    gender: 'male',
    specialization: 'General Physician',
    qualifications: ['MBBS', 'MD Internal Medicine', 'Post-Graduate Diploma in Diabetology'],
    experience: 11,
    consultationFee: 500,
    about: 'General Physician and Diabetologist providing complete management of seasonal infections, diabetes, thyroid disorders, and preventive health checkups.',
    hospital: 'Max Super Speciality Hospital, Mumbai',
    languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
    rating: 4.7,
    totalReviews: 63,
  },
  {
    name: 'K. K. Aggarwal Clinic',
    email: 'aggarwal.physician@example.com',
    phone: '+91 98666 77890',
    gender: 'male',
    specialization: 'General Physician',
    qualifications: ['MBBS', 'MD Internal Medicine', 'FACP'],
    experience: 17,
    consultationFee: 600,
    about: 'Consultant in internal medicine focusing on preventative cardiology, metabolic syndrome, acute infectious diseases, and chronic lifestyle disorders.',
    hospital: 'Apollo Spectra Hospital, Kailash Colony, New Delhi',
    languages: ['English', 'Hindi'],
    rating: 4.8,
    totalReviews: 45,
  },
  {
    name: 'T. Sundaravadivelu',
    email: 'sundar.physician@example.com',
    phone: '+91 98666 77891',
    gender: 'male',
    specialization: 'General Physician',
    qualifications: ['MBBS', 'MD General Medicine (Madras Medical College)'],
    experience: 14,
    consultationFee: 550,
    about: 'Senior physician managing dengue fever, seasonal respiratory viral illnesses, geriatric health, and controlled hypertension therapy.',
    hospital: 'SIMS Hospital, Vadapalani, Chennai',
    languages: ['English', 'Tamil'],
    rating: 4.9,
    totalReviews: 52,
  },
  {
    name: 'Radhika Sharma',
    email: 'radhika.physician@example.com',
    phone: '+91 98666 77892',
    gender: 'female',
    specialization: 'General Physician',
    qualifications: ['MBBS', 'DNB Family Medicine', 'Fellowship in Diabetology'],
    experience: 10,
    consultationFee: 650,
    about: 'Family medicine physician experienced in holistic health, adolescent care, chronic cough diagnosis, obesity, and vitamin deficiencies.',
    hospital: 'Manipal Hospital, Whitefield, Bengaluru',
    languages: ['English', 'Kannada', 'Hindi'],
    rating: 4.8,
    totalReviews: 38,
  },
  {
    name: 'Manoj Varma',
    email: 'manoj.varma@example.com',
    phone: '+91 98666 77893',
    gender: 'male',
    specialization: 'General Physician',
    qualifications: ['MBBS', 'MD Internal Medicine', 'MRCP (UK)'],
    experience: 15,
    consultationFee: 700,
    about: 'Senior consultant handling unexplained fevers, complex multisystemic disorders, fatty liver management, and post-viral recovery care.',
    hospital: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.8,
    totalReviews: 41,
  },

  // ===================== 7. GYNECOLOGY (5 Doctors) =====================
  {
    name: 'Sneha Kulkarni',
    email: 'sneha@example.com',
    phone: '+91 98777 88990',
    gender: 'female',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'MS Obstetrics & Gynecology', 'DNB', 'Fellowship in Laparoscopy'],
    experience: 13,
    consultationFee: 900,
    about: 'Senior Consultant Obstetrician and Gynecologist experienced in high-risk pregnancies, PCOS/PCOD therapy, prenatal counseling, and laparoscopic surgeries.',
    hospital: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.9,
    totalReviews: 40,
  },
  {
    name: 'Anuradha Kapur',
    email: 'anuradha.kapur@example.com',
    phone: '+91 98777 88991',
    gender: 'female',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'MD Obst & Gynae', 'FICOG', 'FICMCH'],
    experience: 22,
    consultationFee: 1100,
    about: 'Senior Director & Head of Unit, specialist in high-risk obstetrics, infertility workups, uterine fibroids, and hysteroscopic surgeries.',
    hospital: 'Max Multi Speciality Hospital, Panchsheel Park, New Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.9,
    totalReviews: 64,
  },
  {
    name: 'Gita Arjun',
    email: 'gita.arjun@example.com',
    phone: '+91 98777 88992',
    gender: 'female',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'MD', 'FACOG (USA)', 'FICOG'],
    experience: 25,
    consultationFee: 1000,
    about: 'Acclaimed author and gynecologist dedicated to evidence-based natural birth, menopause management, and preventative screening.',
    hospital: 'E.V. Kalyani Medical Centre, Mylapore, Chennai',
    languages: ['English', 'Tamil'],
    rating: 5.0,
    totalReviews: 82,
  },
  {
    name: 'Kamini Rao',
    email: 'kamini.rao@example.com',
    phone: '+91 98777 88993',
    gender: 'female',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'DGO', 'DORCP (London)', 'FRCOG (UK)', 'Padma Shri'],
    experience: 26,
    consultationFee: 1200,
    about: 'Padma Shri recipient and reproductive medicine pioneer with world-class expertise in assisted conception, IVF, endometriosis, and recurrent miscarriages.',
    hospital: "Milann Fertility & Women's Hospital, Kumara Park, Bengaluru",
    languages: ['English', 'Kannada', 'Hindi'],
    rating: 4.9,
    totalReviews: 76,
  },
  {
    name: 'Jaideep Malhotra',
    email: 'jaideep.malhotra@example.com',
    phone: '+91 98777 88994',
    gender: 'female',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'MD', 'FRCOG', 'FICS', 'FICOG'],
    experience: 21,
    consultationFee: 950,
    about: 'Past FIGO representative and senior obstetrician specialized in prenatal genetics, fetal medicine, ultrasound screening, and painless labor.',
    hospital: 'Rainbow Hospitals & Apollo Cradle, Delhi NCR',
    languages: ['English', 'Hindi'],
    rating: 4.8,
    totalReviews: 49,
  },

  // ===================== 8. OPHTHALMOLOGY (5 Doctors) =====================
  {
    name: 'Sunita Menon',
    email: 'sunita@example.com',
    phone: '+91 98999 00112',
    gender: 'female',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MS Ophthalmology (Sankara Nethralaya)', 'FICO (UK)'],
    experience: 14,
    consultationFee: 850,
    about: 'Senior Cornea and Refractive Surgeon offering advanced cataract micro-surgery, diabetic retinopathy screening, dry eye therapies, and LASIK evaluations.',
    hospital: 'Sankara Nethralaya, College Road, Chennai',
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
    rating: 5.0,
    totalReviews: 31,
  },
  {
    name: 'Mahipal S. Sachdev',
    email: 'mahipal.eye@example.com',
    phone: '+91 98999 00113',
    gender: 'male',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS (AIIMS)', 'MD Ophthalmology (AIIMS)', 'Padma Shri'],
    experience: 26,
    consultationFee: 1000,
    about: 'Padma Shri awardee and pioneer in modern Blade-free Contoura Vision LASIK, premium multifocal cataract surgery, and corneal transplants.',
    hospital: 'Centre for Sight Eye Hospital, Safdarjung Enclave, New Delhi',
    languages: ['English', 'Hindi'],
    rating: 4.9,
    totalReviews: 78,
  },
  {
    name: 'Amar Agarwal',
    email: 'amar.agarwal@example.com',
    phone: '+91 98999 00114',
    gender: 'male',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MS Ophth', 'FRCS', 'FICO'],
    experience: 24,
    consultationFee: 950,
    about: 'World-renowned eye surgeon, inventor of Phakonit and Glued IOL techniques, leading innovator in complex anterior segment reconstructions.',
    hospital: "Dr. Agarwal's Eye Hospital, Cathedral Road, Chennai",
    languages: ['English', 'Tamil', 'Hindi'],
    rating: 4.9,
    totalReviews: 85,
  },
  {
    name: 'Bhujang Shetty',
    email: 'bhujang.shetty@example.com',
    phone: '+91 98999 00115',
    gender: 'male',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MS Ophthalmology', 'DOMS'],
    experience: 25,
    consultationFee: 800,
    about: 'Founder of Narayana Nethralaya, expert in pediatric eye health, glaucoma laser surgeries, diabetic vitreo-retinal therapies, and community eye care.',
    hospital: 'Narayana Nethralaya, Rajajinagar, Bengaluru',
    languages: ['English', 'Kannada', 'Hindi'],
    rating: 4.9,
    totalReviews: 69,
  },
  {
    name: 'Namrata Sharma',
    email: 'namrata.sharma@example.com',
    phone: '+91 98999 00116',
    gender: 'female',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MD Ophthalmology (AIIMS)', 'DNB', 'FRCS'],
    experience: 20,
    consultationFee: 900,
    about: 'Professor of Ophthalmology specializing in lamellar corneal surgeries (DSAEK, DALK), dry eye ocular surface disorders, and contact lens complications.',
    hospital: 'Dr. R.P. Centre for Ophthalmic Sciences, AIIMS, New Delhi',
    languages: ['English', 'Hindi'],
    rating: 4.8,
    totalReviews: 42,
  },
];

const PENDING_DOCTORS = [
  {
    name: 'Amit Sengupta',
    email: 'amit@example.com',
    phone: '+91 97111 22334',
    gender: 'male',
    specialization: 'Gastroenterology',
    qualifications: ['MBBS', 'MD', 'DM Gastroenterology'],
    experience: 8,
    consultationFee: 1100,
    about: 'Gastroenterologist and hepatologist treating fatty liver, irritable bowel syndrome (IBS), gastritis, and acidity disorders.',
    hospital: 'AMRI Hospitals, Salt Lake, Kolkata',
    languages: ['English', 'Bengali', 'Hindi'],
  },
  {
    name: 'Pooja Deshmukh',
    email: 'pooja@example.com',
    phone: '+91 97222 33445',
    gender: 'female',
    specialization: 'Endocrinology',
    qualifications: ['MBBS', 'MD Medicine', 'DM Endocrinology'],
    experience: 9,
    consultationFee: 950,
    about: 'Endocrinologist focused on thyroid conditions, metabolic syndrome, and advanced diabetes management.',
    hospital: 'Ruby Hall Clinic, Pune',
    languages: ['English', 'Marathi', 'Hindi'],
  },
];

const seedData = async () => {
  try {
    let connected = false;
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
      console.log('✅ Connected to MongoDB Atlas.');
      connected = true;
    } catch (atlasErr) {
      console.warn('⚠️ MongoDB Atlas connection timed out (IP whitelist):', atlasErr.message);
      console.log('🔄 Connecting to local MongoDB (mongodb://127.0.0.1:27017/medical_appointment)...');
      await mongoose.connect('mongodb://127.0.0.1:27017/medical_appointment');
      console.log('✅ Connected to local MongoDB.');
      connected = true;
    }

    console.log('Clearing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Prescription.deleteMany({}),
      Notification.deleteMany({}),
      MedicalRecord.deleteMany({}),
    ]);

    console.log(`Seeding 40 verified Indian specialist doctors across 8 specialties (5 per specialty)...`);

    // 1. Admin Account
    const adminUser = await User.create({
      name: 'Dr. Suresh Ranganathan (Admin)',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '+91 98401 23456',
      role: 'admin',
      gender: 'male',
      isActive: true,
      isEmailVerified: true,
    });

    // 2. Seed All Approved Doctors
    const createdDoctors = [];
    for (const d of DOCTORS_DATA) {
      const u = await User.create({
        name: d.name,
        email: d.email,
        password: 'password123',
        phone: d.phone,
        role: 'doctor',
        gender: d.gender,
        isActive: true,
        isEmailVerified: true,
      });

      const doc = await Doctor.create({
        user: u._id,
        specialization: d.specialization,
        qualifications: d.qualifications,
        experience: d.experience,
        consultationFee: d.consultationFee,
        about: d.about,
        hospital: d.hospital,
        languages: d.languages,
        rating: d.rating,
        totalReviews: d.totalReviews,
        isAvailable: true,
        isApproved: true,
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
          { day: 'Wednesday', startTime: '10:00', endTime: '15:00', slotDuration: 30 },
          { day: 'Friday', startTime: '09:00', endTime: '14:00', slotDuration: 30 },
        ],
        reviews: d.reviews || [],
      });

      createdDoctors.push({ user: u, doctor: doc });
    }

    // 3. Seed Pending Doctors (for Admin approval demo)
    for (const p of PENDING_DOCTORS) {
      const u = await User.create({
        name: p.name,
        email: p.email,
        password: 'password123',
        phone: p.phone,
        role: 'doctor',
        gender: p.gender,
        isActive: true,
        isEmailVerified: true,
      });

      await Doctor.create({
        user: u._id,
        specialization: p.specialization,
        qualifications: p.qualifications,
        experience: p.experience,
        consultationFee: p.consultationFee,
        about: p.about,
        hospital: p.hospital,
        languages: p.languages,
        isAvailable: true,
        isApproved: false, // Pending admin approval
      });
    }

    // 4. Patients
    const patient1 = await User.create({
      name: 'Kavipriyan Murugan',
      email: 'patient@example.com', // Primary demo patient login
      password: 'password123',
      phone: '+91 98409 87654',
      role: 'patient',
      gender: 'male',
      dateOfBirth: new Date('1998-07-21'),
      bloodGroup: 'B+',
      address: {
        street: '14, 2nd Main Road, Anna Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
      },
      isActive: true,
      isEmailVerified: true,
    });

    const patient2 = await User.create({
      name: 'Deepika Sundaram',
      email: 'deepika@example.com',
      password: 'password123',
      phone: '+91 98412 34567',
      role: 'patient',
      gender: 'female',
      dateOfBirth: new Date('1995-11-15'),
      bloodGroup: 'O+',
      address: {
        street: '78, 100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      isActive: true,
      isEmailVerified: true,
    });

    // 5. Seed Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);

    const docRajesh = createdDoctors[0].doctor;
    const docAnanya = createdDoctors[5].doctor;

    const app1 = await Appointment.create({
      patient: patient1._id,
      doctor: docRajesh._id,
      appointmentDate: tomorrow,
      timeSlot: '10:00 AM',
      type: 'in-person',
      status: 'confirmed',
      reason: 'Cardiac wellness review & evaluation of occasional palpitations',
      symptoms: ['Mild shortness of breath on exertion', 'Palpitations'],
      fee: docRajesh.consultationFee,
    });

    const app2 = await Appointment.create({
      patient: patient1._id,
      doctor: docAnanya._id,
      appointmentDate: yesterday,
      timeSlot: '02:30 PM',
      type: 'online',
      status: 'completed',
      reason: 'Dry itchy skin allergy on forearms during weather transition',
      symptoms: ['Itching', 'Red patches', 'Skin dryness'],
      fee: docAnanya.consultationFee,
    });

    // 6. Prescription for Completed Appointment
    const prescription = await Prescription.create({
      appointment: app2._id,
      patient: patient1._id,
      doctor: docAnanya._id,
      diagnosis: 'Contact Atopic Dermatitis (Subacute)',
      medicines: [
        {
          name: 'Levocetirizine 5mg',
          dosage: '1 tablet',
          frequency: 'Once daily at bedtime',
          duration: '7 days',
          instructions: 'Take after dinner',
        },
        {
          name: 'Mometasone Furoate 0.1% Cream',
          dosage: 'Thin layer',
          frequency: 'Once daily at night',
          duration: '5 days',
          instructions: 'Apply gently only to affected red patches',
        },
        {
          name: 'Ceramide Barrier Moisturizing Lotion',
          dosage: 'Liberal application',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Apply within 3 minutes after showering',
        },
      ],
      instructions: 'Use mild, fragrance-free bathing soap. Avoid hot water baths.',
      followUpDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      tests: ['Complete Blood Count (CBC) with Absolute Eosinophil Count (AEC)'],
    });

    app2.prescription = prescription._id;
    await app2.save();

    // 7. Medical Record
    await MedicalRecord.create({
      patient: patient1._id,
      doctor: docAnanya._id,
      appointment: app2._id,
      title: 'Dermatology Consultation & Prescription Summary',
      type: 'prescription',
      description: 'Consultation for atopic dermatitis. Prescribed Levocetirizine and barrier repair moisturizer.',
      date: yesterday,
    });

    // 8. Notifications
    await Notification.create({
      user: patient1._id,
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. Rajesh Sharma on ${tomorrow.toDateString()} at 10:00 AM has been confirmed. Consultation fee: ₹${docRajesh.consultationFee}.`,
      type: 'appointment',
      relatedId: app1._id,
    });

    await Notification.create({
      user: adminUser._id,
      title: '2 Doctor Applications Pending',
      message: `Dr. Amit Sengupta (Gastroenterology) and Dr. Pooja Deshmukh (Endocrinology) submitted verification applications.`,
      type: 'system',
    });

    console.log('✅ Seed successful! 40 Approved Specialist Doctors + 2 Pending Applications Created.');
    console.log('--------------------------------------------------------------------------------');
    console.log('Specialty Breakdown (5 Doctors Each):');
    console.log('1. Cardiology:      5 Doctors (₹1,100 - ₹1,500)');
    console.log('2. Dermatology:     5 Doctors (₹750 - ₹1,000)');
    console.log('3. Pediatrics:      5 Doctors (₹650 - ₹900)');
    console.log('4. Neurology:       5 Doctors (₹1,200 - ₹1,500)');
    console.log('5. Orthopedics:     5 Doctors (₹900 - ₹1,500)');
    console.log('6. General Phys.:   5 Doctors (₹500 - ₹700)');
    console.log('7. Gynecology:      5 Doctors (₹900 - ₹1,200)');
    console.log('8. Ophthalmology:   5 Doctors (₹800 - ₹1,000)');
    console.log('--------------------------------------------------------------------------------');
    console.log('Credentials Summary:');
    console.log('Admin:   admin@example.com   / admin123');
    console.log('Doctor:  doctor@example.com  / password123 (Dr. Rajesh Sharma, Cardiology)');
    console.log('Doctor:  ananya@example.com  / password123 (Dr. Ananya Iyer, Dermatology)');
    console.log('Doctor:  priya@example.com   / password123 (Dr. Priya Nair, Pediatrics)');
    console.log('Doctor:  arvind@example.com  / password123 (Dr. Arvind Swaminathan, Neurology)');
    console.log('Patient: patient@example.com / password123 (Kavipriyan Murugan)');
    console.log('--------------------------------------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
