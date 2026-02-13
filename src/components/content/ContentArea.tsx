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
        <div className="bg-background">
            <AnimatePresence mode="wait">
                {selectedPost ? (
                    <motion.div
                        key="post"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <PostReader />
                    </motion.div>
                ) : selectedCountry ? (
                    <motion.div
                        key={`country-${selectedCountry}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <CountryPostsView />
                    </motion.div>
                ) : (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
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
