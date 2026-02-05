import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";
import SecondaryBanner from "../components/SecondaryBanner";
import NewArrivals from "../components/NewArrivals";
import FeaturedBrands from "../components/FeaturedBrands";

const Home = () => {
    return (
        <div className="mt-5">
            <MainBanner />
            <Categories />
            <BestSeller />
            <FeaturedBrands />
            <NewArrivals />
            <SecondaryBanner />
            <NewsLetter />
        </div>
    );
};

export default Home;