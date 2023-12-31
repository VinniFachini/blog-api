<template>
  <li class="comment-wrapper">
    <div class="comment bg-slate-50 px-3 py-3 rounded-md">
      <img
        class="user-picture"
        :src="
          comment.user.user_image
            ? userImage
            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        "
        :alt="comment.user.username"
      />
      <div class="content-wrapper">
        <span class="username">
          {{ comment.user.username }}
        </span>
        <span class="content">
          {{ comment.content }}
        </span>
      </div>
    </div>
    <ul v-if="comment.replies.length > 0" class="reply-container">
      <li v-for="reply in comment.replies" :key="reply.id">
        <div class="comment bg-slate-50 px-3 py-3 rounded-md">
          <img
            class="user-picture"
            :src="
              reply.user.user_image
                ? reply.user.user_image
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            "
            :alt="reply.user.username"
          />
          <div class="content-wrapper">
            <span class="username">
              {{ reply.user.username }}
            </span>
            <span class="content">
              {{ reply.content }}
            </span>
          </div>
        </div>
        <ul v-if="reply.replies.length > 0" class="reply-container third">
          <li v-for="secondReply in reply.replies" :key="secondReply.id">
            <div class="comment bg-slate-50 px-3 py-3 rounded-md">
              <img
                class="user-picture"
                :src="
                  secondReply.user.user_image
                    ? secondReply.user.user_image
                    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                "
                :alt="secondReply.user.username"
              />
              <div class="content-wrapper">
                <span class="username">
                  {{ secondReply.user.username }}
                </span>
                <span class="content">
                  {{ secondReply.content }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.comment-wrapper {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  flex-direction: column;
  .comment {
    display: flex;
    gap: 10px;
    img {
      width: 100%;
      max-width: 60px;
      cursor: pointer;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 50%;
    }
    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .username {
        font-weight: 500;
        font-size: 1.125rem;
        cursor: pointer;
      }

      .content {
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }
  .reply-container {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 3%;
    position: relative;
    &.third {
      margin-left: 3%;
    }
  }
}
</style>


<script>
export default {
  props: {
    comment: Object,
  },
  data(){
    return {
      userImage: `http://localhost:3001/uploads/${this.$props.comment.user.user_image}`,
    }
  },
  methods: {

  }
};
</script>