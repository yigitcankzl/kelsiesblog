import { AnimatePresence, motion } from 'framer-motion';
import { useBlogStore } from '@/store/store';
import WelcomeView from './WelcomeView';
import CountryPostsView from './CountryPostsView';
import PostReader from './PostReader';
import PhotoStrip from '../PhotoStrip';
import Footer from '../Footer';

export default function ContentArea() {
    const { selectedCountry, selectedPost } = useBlogStore();

    return (
        <div style={{ backgroundColor: '#000', minHeight: '50vh' }}>
            <AnimatePresence mode="sync">
                {selectedPost ? (
                    <motion.div
                        key="post"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ backgroundColor: '#000' }}
                    >
                        <PostReader />
                    </motion.div>
                ) : selectedCountry ? (
                    <motion.div
                        key={`country-${selectedCountry}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ backgroundColor: '#000' }}
                    >
                        <CountryPostsView />
                    </motion.div>
                ) : (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ backgroundColor: '#000' }}
                    >
                        <WelcomeView />
                        <PhotoStrip />
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
}
