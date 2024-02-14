import gsap from 'gsap';

// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    /**
     * initializes hero animation
     */
    const initHeroAnim = () => {
        if (document.querySelector('.hero')) {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 768px)', () => {
                const tl = gsap.timeline();

                tl.to('.hero__mountains', {
                    translateY: 0,
                    opacity: 1,
                    visibility: 'visible',
                    duration: 3
                })
                    .to(
                        '.hero__content',
                        {
                            bottom: 0,
                            translateY: 0,
                            opacity: 1,
                            visibility: 'visible',
                            duration: 2
                        },
                        1.5
                    )
                    .to(
                        '.hero__car',
                        {
                            scale: 1,
                            duration: 2.2
                        },
                        1.5
                    );
            });
        }
    };
    initHeroAnim();
});
