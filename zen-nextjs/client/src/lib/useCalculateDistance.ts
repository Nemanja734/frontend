type Props = {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
};

// Function to calculate distance with the Haversine Method
export const useCalculateDistance = ({
  lat1,
  lon1,
  lat2,
  lon2,
}: Props) => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const d =
    Math.acos(
      Math.sin(p1) * Math.sin(p2) +
        Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
    ) * R;
  return d;
};
