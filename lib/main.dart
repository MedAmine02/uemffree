import 'package:flutter/material.dart';
import 'package:uemffree/conversation_list_page.dart';
import 'package:uemffree/chat_screen.dart';
import 'package:uemffree/services/stream_chat_service.dart';

void main() async {
  // Initialize Stream Chat client here (as you did before)

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Your App Title',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ConversationListPage(),
    );
  }
}

class ConversationListPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Conversations de Amine'),
      ),
      //   body: FutureBuilder<void>(
      //     future: StreamChatService.connectUser('your_user_id'),
      //     builder: (context, snapshot) {
      //       if (snapshot.connectionState == ConnectionState.done) {
      //         return StreamChannelListPage(
      //           onTap: (channelId) {
      //             Navigator.push(
      //               context,
      //               MaterialPageRoute(
      //                 builder: (context) => ChatScreen(channelId: channelId),
      //               ),
      //             );
      //           },
      //           client: StreamChatService.client,
      //         );
      //       } else {
      //         return Center(child: CircularProgressIndicator());
      //       }
      //     },
      //   ),
    );
  }
}





//=================================================

// import 'package:flutter/material.dart';
// import 'package:flutter_socket_io/flutter_socket_io.dart';
// import 'package:flutter_socket_io/socket_io_manager.dart';
// import 'package:audiofileplayer/audiofileplayer.dart';
// import 'package:moment_dart/moment_dart.dart';

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Socket.IO Chat',
//       theme: ThemeData(
//         primarySwatch: Colors.blue,
//       ),
//       home: MyHomePage(),
//     );
//   }
// }

// class MyHomePage extends StatefulWidget {
//   @override
//   _MyHomePageState createState() => _MyHomePageState();
// }

// class _MyHomePageState extends State<MyHomePage> {
//   SocketIO socket;
//   late Audio audioPlayer;
//   int clientsTotal = 0;
//   List<ChatMessage> messages = [];
//   TextEditingController nameController = TextEditingController();
//   TextEditingController messageController = TextEditingController();

//   @override
//   void initState() {
//     super.initState();
//     initSocket();
//     audioPlayer = Audio.load('/message-tone.mp3');
//   }

//   void initSocket() async {
//     socket = SocketIOManager().createSocketIO(
//       'http://your_socket_server_url',
//       '/',
//     );
//     socket.init();
//     socket.connect();
//     socket.onConnect((data) {
//       print('Connected to the server');
//     });

//     socket.on('clients-total', (data) {
//       setState(() {
//         clientsTotal = data;
//       });
//     });

//     socket.on('chat-message', (data) {
//       audioPlayer.play();
//       addMessageToUI(false, data);
//     });

//     socket.on('feedback', (data) {
//       //clearFeedback();
//       addFeedbackToUI(data['feedback']);
//     });
//   }

//   void sendMessage() {
//     if (messageController.text.isEmpty) return;

//     final data = {
//       'name': nameController.text,
//       'message': messageController.text,
//       'dateTime': DateTime.now().toIso8601String(),
//     };

//     socket.sendMessage('message', data);
//     addMessageToUI(true, data);
//     messageController.clear();
//   }

//   void addMessageToUI(bool isOwnMessage, Map<String, dynamic> data) {
//     setState(() {
//       messages.add(ChatMessage(
//         isOwnMessage: isOwnMessage,
//         message: data['message'],
//         name: data['name'],
//         dateTime: DateTime.parse(data['dateTime']),
//       ));
//       scrollToBottom();
//     });
//   }

//   void addFeedbackToUI(String feedback) {
//     setState(() {
//       //messages.add(ChatMessage(feedback: feedback));
//       scrollToBottom();
//     });
//   }

//   /*void clearFeedback() {
//     setState(() {
//       messages.removeWhere((message) => message.feedback != null);
//     });
//   }*/

//   void scrollToBottom() {
//     // Your logic to scroll to the bottom
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Socket.IO Chat'),
//       ),
//       body: Column(
//         children: [
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     controller: nameController,
//                     decoration: InputDecoration(labelText: 'Your Name'),
//                   ),
//                 ),
//                 IconButton(
//                   icon: Icon(Icons.send),
//                   onPressed: () => sendMessage(),
//                 ),
//               ],
//             ),
//           ),
//           Expanded(
//             child: ListView.builder(
//               itemCount: messages.length,
//               itemBuilder: (context, index) {
//                 return messages[index].buildWidget();
//               },
//             ),
//           ),
//           Text('Total Clients: $clientsTotal'),
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     controller: messageController,
//                     decoration: InputDecoration(labelText: 'Type a message'),
//                   ),
//                 ),
//                 IconButton(
//                   icon: Icon(Icons.send),
//                   onPressed: () => sendMessage(),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   @override
//   void dispose() {
//     socket.disconnect();
//     audioPlayer.dispose();
//     super.dispose();
//   }
// }

// class ChatMessage {
//   final bool isOwnMessage;
//   final String message;
//   final String name;
//   final DateTime dateTime;
//   //final String feedback;

//   ChatMessage({
//     required this.isOwnMessage,
//     required this.message,
//     required this.name,
//     required this.dateTime,
//     //required this.feedback,
//   });

//   Widget buildWidget() {
//     /* if (feedback != null) {
//       return ListTile(
//         title: Text(
//           feedback,
//           style: TextStyle(fontStyle: FontStyle.italic),
//         ),
//       );
//     }*/

//     return ListTile(
//       title: Text(message),
//       subtitle: Text('$name ● ${Moment(dateTime).fromNow()}'),
//       trailing: isOwnMessage ? Icon(Icons.send) : null,
//       tileColor: isOwnMessage ? Colors.blue[50] : null,
//     );
//   }
// }
