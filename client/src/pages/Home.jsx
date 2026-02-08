import MainBanner from "../components/MainBanner";
import FeaturedBrands from "../components/FeaturedBrands";
import NewArrivals from "../components/NewArrivals";

const Home = () => {
    return (
        <div>
            <MainBanner />
            <NewArrivals />
            <FeaturedBrands />
        </div>
    );
};

export default Home;