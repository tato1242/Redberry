// Interface for Region
export interface Region {
  id: number;
  name: string;
}

// Interface for City
export interface City {
  region_id: number;
  id: number;
  name: string;
}

// Interface for Agent
export interface Agent {
  id: number;
  name: string;
  surname: string;
  avatar: string;
}

// Interface for Listing
export interface Listing {
  id: number;
  image: string;
  price: number;
}

// Fetch Regions
export async function getRegions(): Promise<Region[]> {
  const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
  if (!response.ok) {
    throw new Error('Failed to fetch Regions');
  }
  return response.json();
}

// Fetch Cities based on regionId
export async function getCities(regionId: number): Promise<City[]> {
  const response = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/cities?region_id=${regionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Cities');
  }
  return response.json();
}

// Fetch all agents
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
    headers: {
      'Authorization': `Bearer 9d009666-7a1f-45e4-b985-baa4be98f866`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Agents');
  }

  return response.json();
}

// Fetch details of a specific listing by ID
export async function getListingDetails(listingId: string): Promise<any> {
  const response = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${listingId}`, {
    headers: {
      'Authorization': `Bearer 9d009666-7a1f-45e4-b985-baa4be98f866`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listing details for ID: ${listingId}`);
  }

  return response.json();
}

// Fetch listings by region id
export async function getListingsByRegionId(regionId: number): Promise<Listing[]> {
  const response = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates?region_id=${regionId}`, {
    headers: {
      'Authorization': `Bearer 9d009666-7a1f-45e4-b985-baa4be98f866`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch listings by region');
  }

  const result = await response.json();
  return result.data.map((listing: any) => ({
    id: listing.id,
    image: listing.image,  // Ensure this is the correct field for the image URL
    price: listing.price,
  }));
}

// Delete a specific listing by ID
export async function deleteListing(listingId: string): Promise<void> {
  const response = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${listingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer 9d009666-7a1f-45e4-b985-baa4be98f866`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete listing with ID: ${listingId}`);
  }
}

// Submit a new listing
export async function submitListing(listingData: any, token: string) {
  try {
    const formData = new FormData();

    formData.append('address', listingData.address);
    formData.append('image', listingData.file);
    formData.append('region_id', listingData.region);
    formData.append('city_id', listingData.cities[0]);
    formData.append('zip_code', listingData.postalCode);
    formData.append('price', listingData.price);
    formData.append('area', listingData.area);
    formData.append('bedrooms', listingData.bedrooms);
    formData.append('description', listingData.description);
    formData.append('is_rental', listingData.saleType === 'rent' ? '1' : '0');
    formData.append('agent_id', listingData.agent);

    const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting listing:', error);
    throw error;
  }
}
