import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { TicketThread, TicketMessage } from '../types/support';
import { supportService } from '../api/services/supportService';

interface TicketChatScreenProps {
  ticketId: number | string;
  onBack: () => void;
}

export const TicketChatScreen: React.FC<TicketChatScreenProps> = ({
  ticketId,
  onBack,
}) => {
  const [thread, setThread] = useState<TicketThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchThread();

    // Poll every 10 seconds for new messages
    const intervalId = setInterval(() => {
      fetchThread(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [ticketId]);

  const fetchThread = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await supportService.getTicketThread(ticketId);
      setThread(data);
      // Optional: automatically mark as read
      await supportService.markAsRead(ticketId).catch(() => {});
    } catch (error) {
      if (!silent) {
        console.warn('Failed to fetch ticket thread', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not load the conversation.',
        });
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    const optimisticMessage: TicketMessage = {
      id: `temp-${Date.now()}`,
      message: replyText.trim(),
      sender_type: 'customer',
      sender_name: 'You',
      created_at: new Date().toISOString(),
    };

    setReplyText('');
    setThread((prev) => prev ? { ...prev, messages: [...prev.messages, optimisticMessage] } : prev);
    
    setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      setIsSending(true);
      await supportService.replyToTicket(ticketId, { message: optimisticMessage.message });
      // Fetch fresh data after send to get actual IDs
      fetchThread();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to send reply',
        text2: error?.message || 'Please try again',
      });
      fetchThread(); // revert optimistic update
    } finally {
      setIsSending(false);
    }
  };

  // Logic to determine if message is sent by current user
  const isMyMessage = (msg: TicketMessage) => {
    return msg.sender_type === 'customer';
  };

  const renderMessage = ({ item }: { item: TicketMessage }) => {
    const isMine = isMyMessage(item);
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>
          {item.message}
        </Text>
        <Text style={[styles.timeText, isMine ? styles.myTimeText : styles.theirTimeText]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (isLoading && !thread) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderTwo title="Support Ticket" leftIcon="chevron-left" onLeftPress={onBack} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTwo 
        title={`Ticket #${ticketId}`} 
        leftIcon="chevron-left" 
        onLeftPress={onBack} 
      />
      
      {thread && (
        <View style={styles.ticketInfoBanner}>
          <View style={styles.ticketInfoLeft}>
            <Text style={styles.ticketSubject} numberOfLines={2}>{thread.subject}</Text>
            <Text style={styles.replyTimeText}>We usually reply within 10 seconds</Text>
          </View>
          <View style={styles.statusBadge}>
             <Text style={styles.statusText}>{thread.status.toUpperCase()}</Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={thread?.messages || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          keyboardShouldPersistTaps="handled"
        />

        {thread?.status !== 'closed' && thread?.status !== 'resolved' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your reply..."
              placeholderTextColor={COLORS.gray}
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!replyText.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendReply}
              disabled={!replyText.trim() || isSending}
            >
              <Icon name="send" size={20} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.closedContainer}>
            <Icon name="lock" size={16} color={COLORS.gray} />
            <Text style={styles.closedText}>This ticket is {thread?.status}.</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  ticketInfoBanner: {
    padding: SPACING.md,
    backgroundColor: COLORS.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ticketInfoLeft: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  ticketSubject: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  replyTimeText: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statusBadge: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
  },
  chatContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  myMessageText: {
    color: COLORS.background,
  },
  theirMessageText: {
    color: COLORS.darkGray,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirTimeText: {
    color: COLORS.gray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingTop: 12, // For multiline
    paddingBottom: 12,
    maxHeight: 120,
    minHeight: 40,
    fontSize: FONT_SIZES.md,
    color: COLORS.darkGray,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    marginBottom: 2, // align with input bottom roughly
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  closedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: SPACING.sm,
  },
  closedText: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
