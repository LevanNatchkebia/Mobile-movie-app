import {View, Text, Image, FlatList, ActivityIndicator} from "react-native";
import React, {useEffect, useState} from "react";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import SearchBar from "@/components/SearchBar";

const Search = () => {

    const [searchQuery, setSearchQuery] = useState('')

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({
        query: searchQuery
    }), false)

    useEffect(() => {
        const timeoutId = setTimeout( async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover'/>
            <FlatList
                data={movies}
                renderItem={({item}) => <MovieCard {...item}/>}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent:'flex-start',
                    gap:16,
                    marginVertical:16
                }}
                className="px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent = {
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10"/>
                        </View>
                        <View className="my-5">
                            <SearchBar
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {moviesLoading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3"/>
                        )}

                        {moviesError && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {moviesError.message}
                            </Text>
                        )}

                        {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
                            <Text className="text-xl text-white">
                                Search Results for {''}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        ) }
                    </>
                }
                ListEmptyComponent = {
                    !moviesLoading && !moviesError? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-light-300">
                                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

export default Search;