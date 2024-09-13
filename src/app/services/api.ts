
export interface Region {
    id: number;
    name: string;
  }
  
  export async function getRegions(): Promise<Region[]> {
    const response = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
    if (!response.ok) {
      throw new Error('Failed to fetch Regions');
    }
    return response.json();
  }
  