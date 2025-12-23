// Helper function to calculate discounted price
export const calculateDiscount = (product, offers) => {
    if (!offers || offers.length === 0) {
        return {
            originalPrice: product.price,
            discountedPrice: product.price,
            discount: 0,
            offer: null
        };
    }

    // Find applicable offers
    const applicableOffers = offers.filter(offer => {
        const now = new Date();
        const validFrom = new Date(offer.validFrom);
        const validUntil = new Date(offer.validUntil);

        return (
            offer.isActive &&
            now >= validFrom &&
            now <= validUntil &&
            (offer.category === 'all' || offer.category === product.category) &&
            (offer.petType === 'all' || offer.petType === product.petType)
        );
    });

    if (applicableOffers.length === 0) {
        return {
            originalPrice: product.price,
            discountedPrice: product.price,
            discount: 0,
            offer: null
        };
    }

    // Get the best offer (highest discount)
    const bestOffer = applicableOffers.reduce((prev, current) =>
        (prev.discountPercentage > current.discountPercentage) ? prev : current
    );

    const discountAmount = (product.price * bestOffer.discountPercentage) / 100;
    const discountedPrice = product.price - discountAmount;

    return {
        originalPrice: product.price,
        discountedPrice: Math.round(discountedPrice),
        discount: bestOffer.discountPercentage,
        offer: bestOffer
    };
};
