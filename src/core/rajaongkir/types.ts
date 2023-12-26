export type ProvinceResponse = {
  rajaongkir: {
    query: { id: string };
    status: { code: number; description: string };
    results: { province_id: string; province: string }[];
  };
};
export type CityResponse = {
  rajaongkir: {
    query: { id: string; province: string } | [];
    status: { code: number; description: string };
    results: {
      city_id: string;
      province_id: string;
      province: string;
      type: string;
      city_name: string;
      postal_code: string;
    }[];
  };
};
