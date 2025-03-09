import { Test, Lab } from '@/types';

// Lab locations in Jaipur
export const labLocations = {
  MALVIYA_NAGAR: 'Malviya Nagar',
  VAISHALI: 'Vaishali Nagar',
  MANSAROVAR: 'Mansarovar',
  RAJA_PARK: 'Raja Park',
  TONK_ROAD: 'Tonk Road',
  MI_ROAD: 'MI Road',
  SODALA: 'Sodala',
  JAWAHAR_CIRCLE: 'Jawahar Circle',
  PRATAP_NAGAR: 'Pratap Nagar',
  CIVIL_LINES: 'Civil Lines'
} as const;

// Lab information
export const labs = {
  LAL_PATH_LABS: {
    id: 'lpl',
    name: 'Dr. Lal PathLabs',
    rating: 4.5,
    accredited: true,
    established: 1995,
    locations: [
      labLocations.MALVIYA_NAGAR,
      labLocations.VAISHALI,
      labLocations.MANSAROVAR,
      labLocations.RAJA_PARK
    ]
  },
  PATHKIND: {
    id: 'pathkind',
    name: 'Pathkind Labs',
    rating: 4.3,
    accredited: true,
    established: 2006,
    locations: [
      labLocations.TONK_ROAD,
      labLocations.MI_ROAD,
      labLocations.SODALA
    ]
  },
  THYROCARE: {
    id: 'thyrocare',
    name: 'Thyrocare',
    rating: 4.4,
    accredited: true,
    established: 1998,
    locations: [
      labLocations.JAWAHAR_CIRCLE,
      labLocations.PRATAP_NAGAR,
      labLocations.CIVIL_LINES
    ]
  },
  SRL: {
    id: 'srl',
    name: 'SRL Diagnostics',
    rating: 4.2,
    accredited: true,
    established: 1995,
    locations: [
      labLocations.MALVIYA_NAGAR,
      labLocations.MANSAROVAR,
      labLocations.MI_ROAD
    ]
  },
  METROPOLIS: {
    id: 'metropolis',
    name: 'Metropolis Healthcare',
    rating: 4.3,
    accredited: true,
    established: 2001,
    locations: [
      labLocations.VAISHALI,
      labLocations.TONK_ROAD,
      labLocations.CIVIL_LINES
    ]
  }
} as const;

// Test categories
export const testCategories = {
  BLOOD: 'Blood Tests',
  DIABETES: 'Diabetes',
  THYROID: 'Thyroid',
  VITAMIN: 'Vitamin Tests',
  LIVER: 'Liver Function',
  KIDNEY: 'Kidney Function',
  HEART: 'Cardiac Tests',
  HORMONE: 'Hormone Tests',
  ALLERGY: 'Allergy Tests',
  CANCER: 'Cancer Screening'
} as const;

// Lab test data
export const labTests: Test[] = [
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    description: 'Comprehensive blood test that checks for RBC, WBC, platelets, and hemoglobin levels. Essential for overall health assessment.',
    category: testCategories.BLOOD,
    parameters: [
      'Red Blood Cell (RBC) Count',
      'White Blood Cell (WBC) Count',
      'Hemoglobin',
      'Hematocrit',
      'Platelet Count',
      'Mean Corpuscular Volume (MCV)'
    ],
    preparation: 'Fasting for 8-10 hours recommended',
    sampleType: 'Blood',
    reportTime: '12-24 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        price: 599,
        discountedPrice: 399,
        locations: [labLocations.MALVIYA_NAGAR, labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.PATHKIND,
        price: 549,
        discountedPrice: 379,
        locations: [labLocations.TONK_ROAD, labLocations.MI_ROAD],
        homeCollection: true,
        homeCollectionCharges: 50
      },
      {
        ...labs.THYROCARE,
        price: 499,
        discountedPrice: 349,
        locations: [labLocations.JAWAHAR_CIRCLE],
        homeCollection: true,
        homeCollectionCharges: 0
      }
    ]
  },
  {
    id: 'thyroid-profile',
    name: 'Thyroid Profile Complete',
    description: 'Comprehensive thyroid function test measuring T3, T4, and TSH levels. Essential for thyroid disorder diagnosis.',
    category: testCategories.THYROID,
    parameters: [
      'Triiodothyronine (T3)',
      'Thyroxine (T4)',
      'Thyroid Stimulating Hormone (TSH)'
    ],
    preparation: 'Early morning test recommended, no fasting required',
    sampleType: 'Blood',
    reportTime: '24 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        price: 1200,
        discountedPrice: 899,
        locations: [labLocations.MALVIYA_NAGAR, labLocations.RAJA_PARK],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.SRL,
        price: 1100,
        discountedPrice: 849,
        locations: [labLocations.MANSAROVAR],
        homeCollection: true,
        homeCollectionCharges: 150
      },
      {
        ...labs.METROPOLIS,
        price: 1300,
        discountedPrice: 999,
        locations: [labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 0
      }
    ]
  },
  {
    id: 'diabetes-profile',
    name: 'Diabetes Profile',
    description: 'Complete diabetes screening with FBS, PPBS, and HbA1c. Essential for diabetes monitoring and diagnosis.',
    category: testCategories.DIABETES,
    parameters: [
      'Fasting Blood Sugar (FBS)',
      'Post Prandial Blood Sugar (PPBS)',
      'HbA1c',
      'Urine Micro Albumin'
    ],
    preparation: '8-10 hours fasting required for FBS',
    sampleType: 'Blood & Urine',
    reportTime: '24 hours',
    labs: [
      {
        ...labs.PATHKIND,
        price: 899,
        discountedPrice: 699,
        locations: [labLocations.TONK_ROAD],
        homeCollection: true,
        homeCollectionCharges: 50
      },
      {
        ...labs.THYROCARE,
        price: 849,
        discountedPrice: 649,
        locations: [labLocations.PRATAP_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.LAL_PATH_LABS,
        price: 999,
        discountedPrice: 749,
        locations: [labLocations.MANSAROVAR],
        homeCollection: true,
        homeCollectionCharges: 100
      }
    ]
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D Total',
    description: 'Measures 25-hydroxy vitamin D levels. Important for bone health and immunity assessment.',
    category: testCategories.VITAMIN,
    parameters: [
      'Vitamin D (25-Hydroxy)',
      'Calcium',
      'Phosphorus'
    ],
    preparation: 'No special preparation required',
    sampleType: 'Blood',
    reportTime: '24-36 hours',
    labs: [
      {
        ...labs.SRL,
        price: 1800,
        discountedPrice: 1299,
        locations: [labLocations.MI_ROAD],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.METROPOLIS,
        price: 1700,
        discountedPrice: 1199,
        locations: [labLocations.CIVIL_LINES],
        homeCollection: true,
        homeCollectionCharges: 150
      },
      {
        ...labs.LAL_PATH_LABS,
        price: 1900,
        discountedPrice: 1399,
        locations: [labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 0
      }
    ]
  },
  {
    id: 'liver-function',
    name: 'Liver Function Test (LFT)',
    description: 'Comprehensive liver health assessment measuring enzymes and proteins. Essential for liver function monitoring.',
    category: testCategories.LIVER,
    parameters: [
      'SGOT (AST)',
      'SGPT (ALT)',
      'Alkaline Phosphatase',
      'Bilirubin Total',
      'Bilirubin Direct',
      'Total Proteins',
      'Albumin'
    ],
    preparation: '8-10 hours fasting required',
    sampleType: 'Blood',
    reportTime: '24 hours',
    labs: [
      {
        ...labs.THYROCARE,
        price: 999,
        discountedPrice: 699,
        locations: [labLocations.CIVIL_LINES],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.PATHKIND,
        price: 1099,
        discountedPrice: 799,
        locations: [labLocations.SODALA],
        homeCollection: true,
        homeCollectionCharges: 50
      },
      {
        ...labs.SRL,
        price: 1199,
        discountedPrice: 899,
        locations: [labLocations.MALVIYA_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 100
      }
    ]
  },
  {
    id: 'lipid-profile',
    name: 'Lipid Profile',
    description: 'Complete cholesterol test including HDL, LDL, and triglycerides. Important for heart health assessment.',
    category: testCategories.HEART,
    parameters: [
      'Total Cholesterol',
      'HDL Cholesterol',
      'LDL Cholesterol',
      'VLDL Cholesterol',
      'Triglycerides'
    ],
    preparation: '12 hours fasting required',
    sampleType: 'Blood',
    reportTime: '24 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        price: 699,
        discountedPrice: 499,
        locations: [labLocations.RAJA_PARK],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.METROPOLIS,
        price: 799,
        discountedPrice: 599,
        locations: [labLocations.TONK_ROAD],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.THYROCARE,
        price: 649,
        discountedPrice: 449,
        locations: [labLocations.JAWAHAR_CIRCLE],
        homeCollection: true,
        homeCollectionCharges: 50
      }
    ]
  },
  {
    id: 'kidney-function',
    name: 'Kidney Function Test (KFT)',
    description: 'Comprehensive kidney health assessment measuring creatinine, urea, and electrolytes.',
    category: testCategories.KIDNEY,
    parameters: [
      'Blood Urea',
      'Serum Creatinine',
      'Uric Acid',
      'Electrolytes (Na, K, Cl)',
      'BUN'
    ],
    preparation: '8-10 hours fasting required',
    sampleType: 'Blood',
    reportTime: '24 hours',
    labs: [
      {
        ...labs.PATHKIND,
        price: 899,
        discountedPrice: 649,
        locations: [labLocations.MI_ROAD],
        homeCollection: true,
        homeCollectionCharges: 50
      },
      {
        ...labs.SRL,
        price: 999,
        discountedPrice: 749,
        locations: [labLocations.MANSAROVAR],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.LAL_PATH_LABS,
        price: 849,
        discountedPrice: 599,
        locations: [labLocations.MALVIYA_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 0
      }
    ]
  },
  {
    id: 'hormone-profile',
    name: 'Hormone Profile',
    description: 'Comprehensive hormone test including testosterone, estrogen, and progesterone levels.',
    category: testCategories.HORMONE,
    parameters: [
      'Testosterone Total',
      'Estradiol',
      'Progesterone',
      'FSH',
      'LH'
    ],
    preparation: 'Early morning test recommended',
    sampleType: 'Blood',
    reportTime: '36-48 hours',
    labs: [
      {
        ...labs.METROPOLIS,
        price: 2499,
        discountedPrice: 1999,
        locations: [labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.LAL_PATH_LABS,
        price: 2699,
        discountedPrice: 2199,
        locations: [labLocations.RAJA_PARK],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.SRL,
        price: 2599,
        discountedPrice: 2099,
        locations: [labLocations.MI_ROAD],
        homeCollection: true,
        homeCollectionCharges: 150
      }
    ]
  },
  {
    id: 'allergy-profile',
    name: 'Allergy Profile Basic',
    description: 'Tests for common allergies including food and environmental allergens.',
    category: testCategories.ALLERGY,
    parameters: [
      'Total IgE',
      'Food Allergens Panel',
      'Inhalant Allergens Panel',
      'Skin Allergens Panel'
    ],
    preparation: 'No special preparation required',
    sampleType: 'Blood',
    reportTime: '48-72 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        price: 3499,
        discountedPrice: 2999,
        locations: [labLocations.MALVIYA_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.THYROCARE,
        price: 3299,
        discountedPrice: 2799,
        locations: [labLocations.PRATAP_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.METROPOLIS,
        price: 3599,
        discountedPrice: 3099,
        locations: [labLocations.CIVIL_LINES],
        homeCollection: true,
        homeCollectionCharges: 150
      }
    ]
  },
  {
    id: 'cancer-markers',
    name: 'Cancer Screening Basic',
    description: 'Basic cancer screening markers including PSA, CEA, and CA-125.',
    category: testCategories.CANCER,
    parameters: [
      'PSA Total',
      'CEA',
      'CA-125',
      'AFP'
    ],
    preparation: '8-10 hours fasting required',
    sampleType: 'Blood',
    reportTime: '48 hours',
    labs: [
      {
        ...labs.SRL,
        price: 4499,
        discountedPrice: 3999,
        locations: [labLocations.MANSAROVAR],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.LAL_PATH_LABS,
        price: 4699,
        discountedPrice: 4199,
        locations: [labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 100
      },
      {
        ...labs.PATHKIND,
        price: 4599,
        discountedPrice: 4099,
        locations: [labLocations.TONK_ROAD],
        homeCollection: true,
        homeCollectionCharges: 150
      }
    ]
  }
];

// Health packages
export const healthPackages = [
  {
    id: 'basic-wellness',
    name: 'Basic Wellness Package',
    description: 'Essential health screening package including basic blood tests, diabetes, and thyroid screening.',
    tests: [
      'Complete Blood Count',
      'Blood Sugar Fasting',
      'Thyroid Stimulating Hormone (TSH)',
      'Urine Routine'
    ],
    price: 1499,
    discountedPrice: 999,
    reportTime: '24-48 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        locations: [labLocations.MALVIYA_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.PATHKIND,
        locations: [labLocations.TONK_ROAD],
        homeCollection: true,
        homeCollectionCharges: 50
      }
    ]
  },
  {
    id: 'comprehensive-wellness',
    name: 'Comprehensive Wellness Package',
    description: 'Complete health check-up including cardiac risk assessment, liver and kidney function tests.',
    tests: [
      'Complete Blood Count',
      'Blood Sugar Fasting & PP',
      'HbA1c',
      'Lipid Profile',
      'Liver Function Test',
      'Kidney Function Test',
      'Thyroid Profile',
      'Vitamin D',
      'Vitamin B12',
      'Urine Routine'
    ],
    price: 4999,
    discountedPrice: 3499,
    reportTime: '48-72 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        locations: [labLocations.RAJA_PARK],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.SRL,
        locations: [labLocations.MI_ROAD],
        homeCollection: true,
        homeCollectionCharges: 100
      }
    ]
  },
  {
    id: 'women-wellness',
    name: "Women's Health Package",
    description: 'Comprehensive health check-up designed specifically for women including hormone tests and cancer screening.',
    tests: [
      'Complete Blood Count',
      'Thyroid Profile',
      'Vitamin D',
      'Vitamin B12',
      'Iron Studies',
      'PAP Smear',
      'Mammogram',
      'CA-125',
      'Hormone Profile'
    ],
    price: 7999,
    discountedPrice: 5999,
    reportTime: '72 hours',
    labs: [
      {
        ...labs.METROPOLIS,
        locations: [labLocations.VAISHALI],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.LAL_PATH_LABS,
        locations: [labLocations.MALVIYA_NAGAR],
        homeCollection: true,
        homeCollectionCharges: 100
      }
    ]
  },
  {
    id: 'senior-citizen',
    name: 'Senior Citizen Package',
    description: 'Comprehensive health check-up designed for adults above 60 years including cardiac, diabetes, and bone health assessment.',
    tests: [
      'Complete Blood Count',
      'Blood Sugar Fasting & PP',
      'HbA1c',
      'Lipid Profile',
      'Liver Function Test',
      'Kidney Function Test',
      'Thyroid Profile',
      'Vitamin D',
      'Vitamin B12',
      'ECG',
      'Chest X-Ray',
      'Bone Density Test',
      'PSA (for men)',
      'Mammogram (for women)'
    ],
    price: 9999,
    discountedPrice: 7499,
    reportTime: '72 hours',
    labs: [
      {
        ...labs.LAL_PATH_LABS,
        locations: [labLocations.RAJA_PARK],
        homeCollection: true,
        homeCollectionCharges: 0
      },
      {
        ...labs.SRL,
        locations: [labLocations.MANSAROVAR],
        homeCollection: true,
        homeCollectionCharges: 150
      }
    ]
  }
];