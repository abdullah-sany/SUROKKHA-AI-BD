/**
 * Bangladesh's 8 divisions and 64 districts (standard public administrative
 * geography, stable since 2015 — see Bangladesh Bureau of Statistics /
 * Wikipedia: Divisions of Bangladesh, Districts of Bangladesh). Used only
 * for the manual location fallback (section 11: "If location is denied,
 * provide manual selection: Division / District / Upazila"). This is NOT
 * healthcare facility data — see server/src/data/seed for that.
 */
export const DIVISIONS_WITH_DISTRICTS: Record<string, string[]> = {
  Dhaka: [
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
    "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail",
  ],
  Chattogram: [
    "Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cox's Bazar",
    "Cumilla", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati",
  ],
  Rajshahi: [
    "Bogura", "Chapai Nawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj",
  ],
  Khulna: [
    "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
  ],
  Barishal: ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
  Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  Rangpur: [
    "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon",
  ],
  Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
};

export const DIVISIONS = Object.keys(DIVISIONS_WITH_DISTRICTS);
