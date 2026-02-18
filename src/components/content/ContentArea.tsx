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
        <div style={{ backgroundColor: '#000' }}>
            <AnimatePresence mode="sync">
                {selectedPost ? (
                    <motion.div
                        key="post"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{ backgroundColor: '#000' }}
                    >
                        <PostReader />
                    </motion.div>
                ) : selectedCountry ? (
                    <motion.div
                        key={`country-${selectedCountry}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{ backgroundColor: '#000' }}
                    >
                        <CountryPostsView />
                    </motion.div>
                ) : (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
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
