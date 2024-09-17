export interface Region {
  id: number;
  name: string;
}

export interface City {
  region_id: number;
  id: number;
  name: string;
}

export interface Agent {
  id: number;
  name: string;
  surname:string;
}

export async function getRegions(): Promise<Region[]> {
  const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
  if (!response.ok) {
    throw new Error('Failed to fetch Regions');
  }
  return response.json();
}

export async function getCities(regionId: number): Promise<City[]> {
  const response = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/cities?region_id=${regionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Cities');
  }
  return response.json();
}

export async function getAgents(): Promise<Agent[]> {
  const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
    headers: {
      'Authorization': `Bearer 9d009666-7a1f-45e4-b985-baa4be98f866`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Agents');
  }
  
  return response.json();
}


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
