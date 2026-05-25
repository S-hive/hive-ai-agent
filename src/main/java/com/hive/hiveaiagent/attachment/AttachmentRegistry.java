package com.hive.hiveaiagent.attachment;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 当前 Manus 任务线程内产生的附件，供 SSE 推送。
 */
public final class AttachmentRegistry {

    private static final ThreadLocal<List<ChatAttachment>> PENDING = ThreadLocal.withInitial(ArrayList::new);

    private AttachmentRegistry() {
    }

    public static void begin() {
        PENDING.set(new ArrayList<>());
    }

    public static void add(ChatAttachment attachment) {
        PENDING.get().add(attachment);
    }

    public static List<ChatAttachment> drainAll() {
        List<ChatAttachment> attachments = new ArrayList<>(PENDING.get());
        PENDING.get().clear();
        return attachments;
    }

    public static List<ChatAttachment> snapshot() {
        return Collections.unmodifiableList(new ArrayList<>(PENDING.get()));
    }

    public static void clear() {
        PENDING.remove();
    }
}
