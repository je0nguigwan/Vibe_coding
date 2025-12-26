import NavBar from "@/components/nav-bar";
import RestaurantCard from "@/components/restaurant-card";
import restaurantsData from "@/data/restaurants.json";
import { Restaurant } from "@/lib/types";

export default function RestaurantsPage() {
  const restaurants = restaurantsData as Restaurant[];

  return (
    <div className="space-y-6">
      <NavBar title="See more" showBack />
      <div className="rounded-3xl border border-[#ecd9cb] bg-[#fff7ef] p-4">
        <p className="text-xs text-[#8e6b5b]">Full list</p>
        <p className="font-semibold text-[color:var(--primary)]">{restaurants.length} restaurants</p>
      </div>
      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} showMapPreview />
        ))}
      </div>
    </div>
  );
}
