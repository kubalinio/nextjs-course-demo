import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

const HomePage = props => {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta name='description' content='Browse a huge list of highly active React meetups!' />
			</Head>
			<MeetupList meetups={props.meetups} />;
		</Fragment>
	);
};

// pobiera dane z serwera przed pre-rendering strony JEDEN Z GŁÓWNYCH ELEMENTÓW NEXT.JS
export const getStaticProps = async () => {
	// Pobieranie danych z API
	const client = await MongoClient.connect(
		'mongodb+srv://kubalinio:qwer1234@cluster0.azkhkts.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map(meetup => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1,
	};
};

export default HomePage;
