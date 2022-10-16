import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = props => {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name='description' content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
};

// Funkcja musi być stworzna zeby strzworzyć każdą możliwą wersje użytkowania tych wartości
// Zwraca obiekt w ktorym opisujemy kazy dynamiczny segment wartosci w tym przypadku kazdy meetupId
export const getStaticPaths = async () => {
	// Pobieranie danych z API
	const client = await MongoClient.connect(
		'mongodb+srv://kubalinio:qwer1234@cluster0.azkhkts.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	// Pobieramy wszystkie meetups do listy,  dane _id, nic wiecej
	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: 'blocking',
		paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } })),
	};
};

export const getStaticProps = async context => {
	// fetch data for a single meetup

	const meetupId = context.params.meetupId;

	// Pobieranie danych z API
	const client = await MongoClient.connect(
		'mongodb+srv://kubalinio:qwer1234@cluster0.azkhkts.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	// Pobieramy tylko pojedynczy meetup,  dane _id, nic wiecej
	const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
};

export default MeetupDetails;
