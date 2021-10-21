import i18next from 'i18next';

i18next.init({
	interpolation: {
		escapeValue: false
	},
	lng: 'en', // 'en' | 'es'
	resources: {
		en: {
			translation: {
				home: { label: 'Home' },
				voicemails: { label: 'Voicemails' },
				callhistory: { label: 'Call History' },
				devices: { label: 'Devices' },
				numbers: { label: 'Numbers' },
				faxes: { label: 'Faxes' },
				missed: { label: 'Missed' },
				calls: { label: 'Calls' },
				new: { label: 'New' },
				news: { label: 'News' },
				total: { label: 'Total' },
				from: { label: 'FROM' },
				to: { label: 'TO' },
				date_time: { label: 'DATE/TIME' },
				duration: { label: 'DURATION' },
				viewall: { label: 'View All' },
				registered: { label: 'Registered' },
				usage: { label: 'Usage' },
				today: { label: 'Today' },
				callcount: { label: 'calls' },
				all_on_page: { label: 'All on page' },
				listened: { label: 'Listened' },
				deleted: { label: 'Deleted' },
				none: { label: 'None' },
				make_as_new: { label: 'Make as New' },
				make_as_deleted: { label: 'Make as Deleted' },
				make_as_listened: { label: 'Make as Listened' },
				status: { label: 'STATUS' },
				close: { label: 'Close' },
				search: { label: 'Search' },
				state_date: { label: 'START DATE' },
				end_date: { label: 'END  DATE' },
				apply: { label: 'Apply' },
				all: { label: 'All' },
				past_week: { label: 'Past Week' },
				vboxtext: {
					label: 'You have multiple voicemail boxes - select one to view the voicemails it contains.'
				},
				view: { label: 'View' },
				per_page: { label: 'per page' },
				no: { label: 'No' },
				results: { label: 'results' },
				recent: { label: 'Recent' },
				unregistered: { label: 'Unregistered' },
				pages: { label: 'PAGES' },
				success: { label: 'Success' },
				failed: { label: 'Failed' },
				viewed: { label: 'Viewed' }
			}
		},
		fr: {
			translation: {
				home: { label: 'home' },
				voicemails: { label: 'voicemails' },
				callhistory: { label: 'call history' },
				devices: { label: 'devices' },
				numbers: { label: 'numbers' },
				faxes: { label: 'faxes' }
			}
		}
	}
});

export default i18next;
