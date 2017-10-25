<template>
    <div class="row nopadding">
        <div class="small-12 column nopadding">

            <div class="row extra-selector__extras-wrapper nopadding" v-for="extra in availableExtras">

                <template v-for="(image, index) in extra.images">
                    <input type="radio" :id="extra.type+extra.id+'-'+index" :name="extra.type+extra.id+'-extra'"
                           :checked="index === 0 ? 'checked' : null"
                           class="extra-selector__carousel-input">
                </template>
                <div class="small-12 medium-12 column extra-selector__description-wrapper">
                    <h4 class="heading-4__extra-title hide-for-large" v-html="extra.name">
                    </h4>
                    <h4 class="heading-4__extra-title-price hide-for-large">
                        &pound;{{ extra.price }}
                    </h4>
                </div>
                <div class="small-12 medium-6 column extra-selector__image-wrapper">
                    <div :id="'Images_' + extra.type+extra.id" class="extra-selector__carousel">
                        <template v-for="(image, index) in extra.images">
                                <img :src="image.imageUrl" class="extra-selector__main-image">
                        </template>
                        <div class="extra-selector__overlay-button-expander-wrapper">
                            <a class="extra-selector__carousel-expand" @click="expand(extra.type+extra.id)"></a>
                        </div>
                    </div>
                    <div class="extra-selector__carousel-thumbs">
                        <template v-for="(image, index) in extra.images">
                            <label class="inline-block extra-selector__image-thumb"
                                   :style="'background-image: url('+image.thumbnailUrl+')'"
                                   :for="extra.type+extra.id+'-'+index"></label>
                        </template>
                    </div>
                </div>
                <div class="small-12 medium-6 column extra-selector__description-wrapper">
                    <h4 class="heading-4__extra-title show-for-large" v-html="extra.name">
                    </h4>
                    <h4 class="heading-4__extra-title-price show-for-large">
                        &pound;{{ extra.price }}
                    </h4>

                    <div class="row extra-selector__add-cta">
                        <div class="small-6 column">
                            <multiselect :options="massageExtraSteps(extra)" :searchable="false" placeholder="0"
                                         :allow-empty="true" v-model="extra.selectedValue"
                                         :show-labels="false"></multiselect>
                        </div>
                        <div class="small-6 column">
                            <a class="" :class="['button margin-bottom-medium rotate-ccw-small show-for-large']"
                               @click="extraAdded(extra.id)">
                        <span class="button__inner">
                            <span class="button__text">Add</span>
                            <svg class="button__arrow">
                                <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                     xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                            </svg>
                        </span>
                            </a>

                                <a class="" v-show="extra.selectedValue > 0"
                                   :class="['button margin-bottom-medium rotate-ccw-small hide-for-large extra-selector__tooltip-included']"
                                   @click="extraAdded(extra.id, true)" v-tooltip="mediumTooltip(extra.id)">
                                    <span class="button__inner">
                                        <span class="button__text">Add</span>
                                        <svg class="button__arrow">
                                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                        </svg>
                                    </span>
                                </a>

                                <a class="" v-show="!extra.selectedValue"
                                   :class="['button margin-bottom-medium rotate-ccw-small hide-for-large extra-selector__tooltip-included']"
                                   @click="extraAdded(extra.id, true)">
                                    <span class="button__inner">
                                        <span class="button__text">Add</span>
                                        <svg class="button__arrow">
                                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                        </svg>
                                    </span>
                                </a>

                        </div>
                    </div>

                    <div v-html="extra.shortDescription" class="extra-selector__extra-content"></div>
                    <div class="hide-for-large" @click="reveal($event, '#' + extra.type+extra.id)">
                        <a class="extra-selector__more-info">
                            More info
                            <div class="image-misc__image--chevron-down inline-block"></div>
                        </a>
                    </div>
                    <div :id="extra.type+extra.id" v-html="extra.description"
                         class="extra-selector__extra-content show-for-large"></div>
                </div>
                <div :id="'Overlay_' + extra.type+extra.id" class="gallery-overlay overlay">
                    <div class="overlay__background">
                        <a class="gallery-overlay__close"><span class="gallery-overlay__close-text">Close</span></a>

                        <div class="overlay__content overlay__content--gallery-overlay swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide swiper-slide--gallery-overlay" v-for="image in extra.images">
                                    <img class="gallery-overlay__image lazyload" :src="image.imageUrl">
                                    <div class="extra-selector__overlay-button-expander-wrapper--overlay">
                                        <a class="polaroid-carousel__button--gallery-overlay -previous -extra-overlay"></a>
                                        <a class="polaroid-carousel__button--gallery-overlay -next -extra-overlay"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Booking from '../mixins/Booking';

    export default {
        mixins: [Booking],
        data() {
            return {
                selectedExtras: []
            }
        },
        beforeDestroy() {
            _.forEach(this.availableExtras, extra => {
                extra.selectedValue = 0;
            });
        },
        methods: {
            expand(type) {
                const $overlay = $('#Overlay_' + type);
                const $images = $('#Images_' + type + ' .extra-selector__main-image');

                const $close = $overlay.find('.gallery-overlay__close');

                const $nextButton = $overlay.find('.polaroid-carousel__button--gallery-overlay.-next');
                const $prevButton = $overlay.find('.polaroid-carousel__button--gallery-overlay.-previous');

                const index = $images.index($images.filter((index, element) => {
                    return $(element).css('opacity') === '1';
                }));

                $overlay.addClass('-open');

                const swiper = new Swiper($overlay.find('.swiper-container'), {
                    speed: 400,
                    initialSlide: index,
                    setWrapperSize: true,
                    slidesPerView: 1,
                    simulateTouch: false,
                    preventClicks: true,
                    nextButton: $nextButton,
                    prevButton: $prevButton,
                });

                $close.on('click', () => {
                    $overlay.removeClass('-visible');

                    setTimeout(() => {
                        $overlay.removeClass('-open');
                        swiper.destroy();
                    }, 500);
                });

                setTimeout(() => {
                    $overlay.addClass('-visible');
                }, 100);
            },
            reveal(event, target) {
                $(event.target).toggleClass('extra-selector__more-info--open');
                $(target).toggleClass('show-for-large');
            },
            extraAdded(id, responsive = false) {
                const foundExtra = _.find(this.availableExtras, {id});
                this.closeToolTips();
                if (foundExtra && foundExtra.selectedValue > 0) {
                    this.$emit('addExtra', foundExtra);
                    setTimeout(() => {
                        this.closeToolTips();
                    }, 1500);
                }
            },
            closeToolTips() {
                const tt = $('.extra-selector__tooltip-included');
                $.each(tt, (t, i) => {
                    if (i._tooltip && i._tooltip.hide) {
                        i._tooltip.hide();
                    }
                });
            },
            mediumTooltip(id) {
                const foundExtra = _.find(this.availableExtras, {id});
                return {
                    trigger: 'click',
                    placement: 'top',
                    classes: `day-selector__selected-wrapper extra-selector__tooltip hide-for-large`,
                    content: `
                    <div class="day-selector__responsive-selected extra-selector__responsive-selected text-center">
                        ${foundExtra.selectedValue > 0 ? foundExtra.selectedValue : ``} ${foundExtra.name} <br /> has been added to your cart.
                    </div>`
                };
            },
            massageExtraSteps(extra) {
            	if(extra.multiple > 1) {
            		return _.filter(extra.steps, function (step) {
                        return step === 25 || step === 50 || step === 75 || step === 100 || step === 150 || step === 200;
		            });
                } else {
            		return extra.steps;
                }
            }
        }
    }
</script>