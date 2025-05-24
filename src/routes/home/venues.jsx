import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VenueCard } from '../../components/Cards/VenueCard.jsx';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/api/useFetch.jsx';
import { API_VENUE } from '../../utilities/constants.js';
import { Searchbar } from '../../components/UI/Searchbar.jsx';
import { Filter } from '../../components/UI/Filter.jsx';

function VenueList({ venues, loading, error, onLoadMore, hasMore, loadingMore }) {
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loadingMore && !loading) {
                    onLoadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
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

    const currentApiUrl = `${baseApiUrl}&page=${currentPage}`;
    const { data, loading, error } = useFetch(currentApiUrl, false);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            if (isInitialLoad || currentPage === 1) {
                setAllVenues(data);
                setIsInitialLoad(false);
            } else {
                setAllVenues(prevVenues => {
                    const existingIds = new Set(prevVenues.map(v => v.id));
                    const newVenues = data.filter(venue => !existingIds.has(venue.id));
                    return [...prevVenues, ...newVenues];
                });
            }

            if (data.length < 100 || data.length === 0) {
                setHasMore(false);
            }

            setLoadingMore(false);
        }
    }, [data, currentPage, isInitialLoad]);

    useEffect(() => {
        if (error) {
            setLoadingMore(false);
        }
    }, [error]);

    useEffect(() => {
        if (!loading && loadingMore) {
            setLoadingMore(false);
        }
    }, [loading, loadingMore]);

    const handleUrlChange = useCallback((newUrl) => {
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

        if (loadingMore || !hasMore || loading) {
            return;
        }

        setLoadingMore(true);
        setCurrentPage(prevPage => {
            const newPage = prevPage + 1;
            return newPage;
        });
    }, [loadingMore, hasMore, loading, currentPage, allVenues.length]);

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