const movieLists = {
  'Animated Classics': [
    'Spirited Away', 'The Lion King', 'Beauty and the Beast', 'Toy Story', 'Princess Mononoke',
    'WALL-E', 'My Neighbor Totoro', 'The Iron Giant', 'Snow White and the Seven Dwarfs', 'Pinocchio',
    'Fantasia', 'The Little Mermaid', 'Aladdin', 'Toy Story 2', 'Finding Nemo',
    'The Incredibles', 'Up', 'Inside Out', 'Howl\'s Moving Castle', 'Bambi',
    'Cinderella', 'Sleeping Beauty', 'The Jungle Book', 'Shrek', 'Monsters, Inc.',
    'Ratatouille', 'Kiki\'s Delivery Service', 'The Nightmare Before Christmas', 'Akira', 'Coco'
  ],
  'Horror Essentials': [
    'The Exorcist', 'Halloween', 'The Shining', 'Psycho', 'Alien',
    'The Texas Chain Saw Massacre', 'Rosemary\'s Baby', 'Night of the Living Dead', 'Suspiria', 'The Thing',
    'A Nightmare on Elm Street', 'Friday the 13th', 'Scream', 'The Silence of the Lambs', 'Poltergeist',
    'The Omen', 'Carrie', 'An American Werewolf in London', 'The Wicker Man', 'Don\'t Look Now',
    'The Birds', 'Jaws', 'The Babadook', 'Hereditary', 'Get Out',
    'The Conjuring', 'It Follows', 'The Ring', 'Dawn of the Dead', 'Evil Dead'
  ],
  'Romance Classics': [
    'Casablanca', 'The Princess Bride', 'When Harry Met Sally', 'Roman Holiday', 'Titanic',
    'The Notebook', 'Sleepless in Seattle', 'Dirty Dancing', 'Ghost', 'Pretty Woman',
    'An Affair to Remember', 'Singin\' in the Rain', 'The Philadelphia Story', 'It Happened One Night', 'Brief Encounter',
    'Gone with the Wind', 'You\'ve Got Mail', 'The Way We Were', 'Love Actually', 'Eternal Sunshine of the Spotless Mind',
    'Before Sunrise', 'The Lady Eve', 'His Girl Friday', 'Amelie', 'Say Anything',
    'The English Patient', 'Out of Africa', 'Breakfast at Tiffany\'s', 'Notting Hill', 'City Lights'
  ],
  'Comedy Classics': [
    'Some Like It Hot', 'The Great Dictator', 'Dr. Strangelove', 'Airplane!', 'The Big Lebowski',
    'Groundhog Day', 'Monty Python and the Holy Grail', 'Young Frankenstein', 'The Princess Bride', 'Blazing Saddles',
    'Duck Soup', 'City Lights', 'Modern Times', 'The Gold Rush', 'Annie Hall',
    'Manhattan', 'The Odd Couple', 'Tootsie', 'The Producers', 'Being There',
    'Sullivan\'s Travels', 'The Lady Eve', 'His Girl Friday', 'Bringing Up Baby', 'The Grand Budapest Hotel',
    'Rushmore', 'Anchorman', 'There\'s Something About Mary', 'Ghostbusters', 'Coming to America'
  ],
  'Adventure Epics': [
    'Raiders of the Lost Ark', 'The Lord of the Rings: The Fellowship of the Ring', 'The Lord of the Rings: The Two Towers', 'The Lord of the Rings: The Return of the King', 'Lawrence of Arabia',
    'The Adventures of Robin Hood', 'Treasure Island', 'The Bridge on the River Kwai', 'Gunga Din', 'North by Northwest',
    'The Treasure of the Sierra Madre', 'The African Queen', 'The Man Who Would Be King', 'Captain Blood', 'The Sea Hawk',
    'Mutiny on the Bounty', 'The Thief of Bagdad', 'Indiana Jones and the Temple of Doom', 'Indiana Jones and the Last Crusade', 'The Princess Bride',
    'Pirates of the Caribbean: The Curse of the Black Pearl', 'The Mummy', 'National Treasure', 'The Goonies', 'Romancing the Stone',
    'The Rocketeer', 'The Mask of Zorro', 'The Count of Monte Cristo', 'Master and Commander', 'Mad Max: Fury Road'
  ],
  'Crime Masterpieces': [
    'The Godfather', 'The Godfather Part II', 'Goodfellas', 'Pulp Fiction', 'Scarface',
    'The Departed', 'Casino', 'Heat', 'The Long Good Friday', 'Miller\'s Crossing',
    'Once Upon a Time in America', 'White Heat', 'The Public Enemy', 'Little Caesar', 'Bonnie and Clyde',
    'The French Connection', 'Serpico', 'Mean Streets', 'Donnie Brasco', 'The Untouchables',
    'L.A. Confidential', 'Chinatown', 'The Maltese Falcon', 'The Big Sleep', 'Double Indemnity',
    'The Third Man', 'Touch of Evil', 'Reservoir Dogs', 'The Usual Suspects', 'Fargo'
  ],
  'Family Favorites': [
    'E.T. the Extra-Terrestrial', 'The Wizard of Oz', 'Mary Poppins', 'The Sound of Music', 'Home Alone',
    'The NeverEnding Story', 'Big', 'The Karate Kid', 'Back to the Future', 'The Sandlot',
    'Matilda', 'The Little Princess', 'Hook', 'Mrs. Doubtfire', 'The Parent Trap',
    'School of Rock', 'The Iron Giant', 'WALL-E', 'Up', 'Inside Out',
    'Coco', 'Moana', 'Frozen', 'The Incredibles', 'Finding Nemo',
    'Toy Story', 'Monsters, Inc.', 'Shrek', 'The Princess Bride', 'Harry Potter and the Philosopher\'s Stone'
  ],
  'Fantasy Epics': [
    'The Lord of the Rings: The Fellowship of the Ring', 'The Lord of the Rings: The Two Towers', 'The Lord of the Rings: The Return of the King', 'The Wizard of Oz', 'Pan\'s Labyrinth',
    'The Princess Bride', 'Willow', 'The NeverEnding Story', 'Big Fish', 'Edward Scissorhands',
    'The Dark Crystal', 'Labyrinth', 'The Shape of Water', 'Spirited Away', 'Princess Mononoke',
    'My Neighbor Totoro', 'Howl\'s Moving Castle', 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'Harry Potter and the Philosopher\'s Stone', 'Harry Potter and the Chamber of Secrets',
    'The Green Knight', 'The Seventh Seal', 'Excalibur', 'The Thief of Bagdad', 'Jason and the Argonauts',
    'The Last Unicorn', 'Legend', 'Coraline', 'The Secret of NIMH', 'Time Bandits'
  ],
  'Sci-Fi Classics': [
    '2001: A Space Odyssey', 'Blade Runner', 'Star Wars', 'The Matrix', 'Alien',
    'E.T. the Extra-Terrestrial', 'Terminator 2: Judgment Day', 'Back to the Future', 'Close Encounters of the Third Kind', 'Interstellar',
    'Metropolis', 'The Day the Earth Stood Still', 'Forbidden Planet', 'Planet of the Apes', 'The Time Machine',
    'Invasion of the Body Snatchers', 'The War of the Worlds', 'Fantastic Voyage', 'Logan\'s Run', 'Star Trek: The Motion Picture',
    'The Empire Strikes Back', 'Return of the Jedi', 'The Terminator', 'Robocop', 'Total Recall',
    'Jurassic Park', 'The Fifth Element', 'Men in Black', 'Contact', 'The Iron Giant'
  ]
};

// This would be used to generate SQL inserts, but for now I'll create the SQL manually
console.log('Movie lists ready for TMDB lookup'); 