import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VenueCard } from '../../components/Cards/VenueCard.jsx';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/api/useFetch.jsx';
import { API_VENUE } from '../../utilities/constants.js';
import { Searchbar } from '../../components/UI/Searchbar.jsx';
import { Filter } from '../../components/UI/Filter.jsx';

function VenueList({ venues, loading, error, onLoadMore, hasMore, loadingMore }) {
    const loadMoreRef = useRef(null);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                console.log('Intersection observed:', {
                    isIntersecting: target.isIntersecting,
                    hasMore,
                    loadingMore,
                    loading
                });
                if (target.isIntersecting && hasMore && !loadingMore && !loading) {
                    console.log('Triggering load more');
                    onLoadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px', // Start loading 100px before reaching the bottom
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
            console.log('Observer attached to element');
        } else {
            console.log('Load more ref not available');
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasMore, loadingMore, loading, onLoadMore]);

    if (loading && venues.length === 0) {
        return <div className="text-center text-gray-600">Loading venues...</div>;
    }

    if (error && venues.length === 0) {
        return <div className="text-center text-red-500">Error loading venues: {error.message}</div>;
    }

    if (venues.length === 0 && !loading) {
        return <div className="text-center text-gray-600">No venues found matching your criteria.</div>;
    }

    return (
        <div>
            <title>Holidaze || Venues</title>
            <div className="flex flex-wrap lg:justify-between justify-center gap-4">
                {venues.map((venue) => (
                    <div key={venue.id} className="w-[310px]">
                        <Link to={`/venue/${venue.id}`}>
                            <VenueCard
                                title={venue.name}
                                image={venue.media?.[0]?.url}
                                city={venue.location?.city || 'Unknown City'}
                                country={venue.location?.country || 'Unknown Country'}
                                price={venue.price || 0}
                                wifi={venue.meta?.wifi || false}
                                parking={venue.meta?.parking || false}
                                breakfast={venue.meta?.breakfast || false}
                                pets={venue.meta?.pets || false}
                                rating={venue.rating || 0}
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Loading indicator and scroll trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8 min-h-[100px] bg-gray-50">
                {loadingMore && (
                    <div className="text-center text-gray-600">Loading more venues...</div>
                )}
                {!hasMore && venues.length > 0 && (
                    <div className="text-center text-gray-500">No more venues to load</div>
                )}
                {error && venues.length > 0 && (
                    <div className="text-center text-red-500">Error loading more venues</div>
                )}
                {hasMore && !loadingMore && venues.length > 0 && (
                    <div className="text-center text-gray-400">Scroll to load more venues</div>
                )}
            </div>
        </div>
    );
}

export function Venues() {
    const baseUrl = `${API_VENUE}`;
    const [baseApiUrl, setBaseApiUrl] = useState(`${baseUrl}?limit=100&sort=created&sortOrder=desc`);
    const [allVenues, setAllVenues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [localFilterFunction, setLocalFilterFunction] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Construct current API URL with page
    const currentApiUrl = `${baseApiUrl}&page=${currentPage}`;
    const { data, loading, error } = useFetch(currentApiUrl, false);

    // Handle new data from API
    useEffect(() => {
        if (data && Array.isArray(data)) {
            if (isInitialLoad || currentPage === 1) {
                // First load or reset - replace all venues
                setAllVenues(data);
                setIsInitialLoad(false);
            } else {
                // Additional load - append new venues
                setAllVenues(prevVenues => {
                    // Avoid duplicates by checking if venues already exist
                    const existingIds = new Set(prevVenues.map(v => v.id));
                    const newVenues = data.filter(venue => !existingIds.has(venue.id));
                    return [...prevVenues, ...newVenues];
                });
            }

            // Check if we've reached the end - if we get fewer than 100 venues OR no new venues
            if (data.length < 100 || data.length === 0) {
                setHasMore(false);
            }

            // Always set loadingMore to false when we receive data
            setLoadingMore(false);
        }
    }, [data, currentPage, isInitialLoad]);

    // Handle errors and loading states
    useEffect(() => {
        if (error) {
            setLoadingMore(false);
            setHasMore(false); // Stop trying to load more on error
        }
    }, [error]);

    // Reset loadingMore when loading completes (success or failure)
    useEffect(() => {
        if (!loading && loadingMore) {
            setLoadingMore(false);
        }
    }, [loading, loadingMore]);

    const handleUrlChange = useCallback((newUrl) => {
        // Reset everything when URL changes (e.g., from search or filter)
        setBaseApiUrl(newUrl);
        setCurrentPage(1);
        setAllVenues([]);
        setHasMore(true);
        setIsInitialLoad(true);
    }, []);

    const handleFiltersChange = useCallback((filters, filterFunction) => {
        setLocalFilterFunction(() => filterFunction);
    }, []);

    const loadMoreVenues = useCallback(() => {
        console.log('loadMoreVenues called with conditions:', {
            loadingMore,
            hasMore,
            loading,
            currentPage,
            allVenuesLength: allVenues.length
        });

        if (loadingMore || !hasMore || loading) {
            console.log('Load more blocked:', { loadingMore, hasMore, loading });
            return;
        }

        console.log('Loading more venues...', { currentPage, hasMore, loadingMore });
        setLoadingMore(true);
        setCurrentPage(prevPage => {
            const newPage = prevPage + 1;
            console.log('Setting new page:', newPage);
            return newPage;
        });
    }, [loadingMore, hasMore, loading, currentPage, allVenues.length]);

    // Apply local filters to all venues
    const filteredVenues = localFilterFunction ? localFilterFunction(allVenues) : allVenues;

    return (
        <div className="w-[70vw] mx-auto p-5 flex flex-col gap-10 justify-center">
            <div className="w-full flex justify-center">
                <Searchbar />
            </div>
            <Filter
                baseUrl={baseUrl}
                onUrlChange={handleUrlChange}
                onFiltersChange={handleFiltersChange}
            />
            <VenueList
                venues={filteredVenues}
                loading={loading && isInitialLoad}
                error={error}
                onLoadMore={loadMoreVenues}
                hasMore={hasMore}
                loadingMore={loadingMore}
            />
        </div>
    );
}